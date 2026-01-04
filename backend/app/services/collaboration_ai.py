# backend/app/services/collaboration_ai.py

import json
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from openai import OpenAI, OpenAIError

from ..models import Lab, IdealLab

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)


class CollaborationAIService:
    def __init__(self):
        self.model_name = "gpt-4o-mini"

    def calculate_collaboration_score(self, ideal_lab: IdealLab, target_lab: Lab) -> dict:
        """
        Calculate collaboration score based on multiple factors
        Returns: {"score": float, "breakdown": {...}}
        """
        score = 0.0
        breakdown = {}

        # 1. Domain Match (30 points max)
        domain_score = 0
        if ideal_lab.domain and target_lab.domain:
            if ideal_lab.domain.lower() == target_lab.domain.lower():
                domain_score = 30
                breakdown["domain_match"] = "Perfect match"
            elif ideal_lab.domain.lower() in target_lab.domain.lower() or \
                 target_lab.domain.lower() in ideal_lab.domain.lower():
                domain_score = 20
                breakdown["domain_match"] = "Partial match"
            else:
                domain_score = 5
                breakdown["domain_match"] = "Different domains"
        score += domain_score

        # 2. Sub-domain Overlap (20 points max)
        subdomain_score = 0
        if ideal_lab.sub_domains and target_lab.sub_domains:
            ideal_subs = set([s.strip().lower() for s in ideal_lab.sub_domains.split(",")])
            target_subs = set([s.strip().lower() for s in target_lab.sub_domains.split(",")])
            overlap = ideal_subs.intersection(target_subs)
            
            if overlap:
                subdomain_score = min(20, len(overlap) * 7)  # 7 points per overlap
                breakdown["subdomain_overlap"] = f"{len(overlap)} common sub-domains"
            else:
                breakdown["subdomain_overlap"] = "No overlap"
        score += subdomain_score

        # 3. Resource Compatibility (20 points max)
        resource_score = 0
        
        # Equipment level match
        if ideal_lab.equipment_level and target_lab.equipment_level:
            levels = {"high": 3, "medium": 2, "low": 1}
            ideal_level = levels.get(ideal_lab.equipment_level.lower(), 0)
            target_level = levels.get(target_lab.equipment_level.lower(), 0)
            
            level_diff = abs(ideal_level - target_level)
            if level_diff == 0:
                resource_score += 10
                breakdown["equipment"] = "Similar equipment level"
            elif level_diff == 1:
                resource_score += 5
                breakdown["equipment"] = "Compatible equipment"
            else:
                breakdown["equipment"] = "Different equipment levels"

        # Computing resources match
        if ideal_lab.computing_resources and target_lab.computing_resources:
            ideal_comp = set([c.strip().lower() for c in ideal_lab.computing_resources.split(",")])
            target_comp = set([c.strip().lower() for c in target_lab.computing_resources.split(",")])
            comp_overlap = ideal_comp.intersection(target_comp)
            
            if comp_overlap:
                resource_score += 10
                breakdown["computing"] = f"Shared: {', '.join(comp_overlap)}"
            else:
                breakdown["computing"] = "Different computing resources"
        
        score += resource_score

        # 4. Team Size Compatibility (15 points max)
        team_score = 0
        ideal_researchers = ideal_lab.total_researchers or 0
        target_researchers = target_lab.total_researchers or 0
        
        if ideal_researchers > 0 and target_researchers > 0:
            # Both have active teams
            team_score += 10
            
            # Similar team sizes (within 50%)
            ratio = min(ideal_researchers, target_researchers) / max(ideal_researchers, target_researchers)
            if ratio >= 0.5:
                team_score += 5
                breakdown["team_size"] = "Similar team sizes"
            else:
                breakdown["team_size"] = "Different team sizes"
        score += team_score

        # 5. Availability & Workload (15 points max)
        availability_score = 0
        
        # Check availability status
        if target_lab.availability_status:
            if target_lab.availability_status.lower() == "available":
                availability_score += 10
                breakdown["availability"] = "Currently available"
            elif target_lab.availability_status.lower() == "busy":
                availability_score += 5
                breakdown["availability"] = "Busy but open"
            else:
                breakdown["availability"] = "Not available"
        
        # Check workload
        if target_lab.workload_score is not None:
            if target_lab.workload_score < 70:
                availability_score += 5
                breakdown["workload"] = "Low workload"
            elif target_lab.workload_score < 85:
                availability_score += 2
                breakdown["workload"] = "Medium workload"
            else:
                breakdown["workload"] = "High workload"
        
        score += availability_score

        # Normalize score to 0-100
        score = min(100, score)

        return {
            "score": round(score, 1),
            "breakdown": breakdown,
            "grade": self._get_grade(score)
        }

    def _get_grade(self, score: float) -> str:
        """Convert score to letter grade"""
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Fair"
        elif score >= 30:
            return "Poor"
        else:
            return "Poor"

    async def generate_suggestions(self, db: Session, task: str):
        ideal_lab = db.query(IdealLab).first()
        labs = db.query(Lab).all()

        if not ideal_lab:
            return {"error": "IDEAL Lab not configured"}

        # Calculate scores for all labs
        scored_labs = []
        for lab in labs:
            score_data = self.calculate_collaboration_score(ideal_lab, lab)
            
            scored_labs.append({
                "lab_id": lab.id,
                "lab_name": lab.name,
                "lab_email": lab.email,  # ✅ Include email for frontend
                "domain": lab.domain,
                "score": score_data["score"],
                "grade": score_data["grade"],
                "score_breakdown": score_data["breakdown"]
            })

        # Sort by score (descending)
        scored_labs.sort(key=lambda x: x["score"], reverse=True)

        # Use GPT to generate reasoning and project recommendations
        top_labs = scored_labs[:5]  # Top 5 only
        
        labs_for_gpt = [
            {
                "lab_name": l["lab_name"],
                "domain": l["domain"],
                "score": l["score"],
                "grade": l["grade"]
            }
            for l in top_labs
        ]

        prompt = f"""
You are a research collaboration advisor.

IDEAL Lab wants to find collaboration opportunities.
Task: {task}

Here are the top-scored labs based on compatibility metrics:
{json.dumps(labs_for_gpt, indent=2)}

For EACH lab, provide:
1. A brief reason WHY this collaboration makes sense (2-3 sentences)
2. 2-3 specific project ideas they could work on together

Return ONLY valid JSON in this format:
{{
  "recommendations": [
    {{
      "lab_name": "...",
      "reason": "...",
      "recommended_projects": ["...", "...", "..."]
    }}
  ]
}}
"""

        try:
            response = client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful research collaboration advisor. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )

            text = response.choices[0].message.content.strip()

            # Clean JSON
            if text.startswith("```"):
                text = text.split("```")[1].strip()
                if text.lower().startswith("json"):
                    text = text[4:].strip()

            gpt_data = json.loads(text)

            # Merge GPT insights with our scored data
            final_recommendations = []
            for lab in top_labs:
                # Find matching GPT recommendation
                gpt_rec = next(
                    (r for r in gpt_data.get("recommendations", []) 
                     if r.get("lab_name") == lab["lab_name"]),
                    {}
                )

                final_recommendations.append({
                    **lab,  # Include all score data + email
                    "reason": gpt_rec.get("reason", "Potential collaboration opportunity"),
                    "recommended_projects": gpt_rec.get("recommended_projects", [])
                })

            return {"recommendations": final_recommendations}

        except json.JSONDecodeError as e:
            return {
                "error": "Invalid JSON from GPT",
                "raw_response": text if 'text' in locals() else None
            }

        except OpenAIError as e:
            return {"error": f"OpenAI API error: {str(e)}"}

        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}