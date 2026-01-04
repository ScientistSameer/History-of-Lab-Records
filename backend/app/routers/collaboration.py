# backend/app/routers/collaboration.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from pydantic import BaseModel
from ..email import send_email
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/collaboration", tags=["Collaboration"])

IDEAL_LABS = {
    "id": 0,
    "name": "IDEAL Labs",
    "domain": "Artificial Intelligence",
    "email": os.getenv("SMTP_EMAIL")
}

# ✅ UPDATED: Accept custom subject and body
class EmailRequest(BaseModel):
    to_lab_id: int
    subject: str = None  # Optional, will use default if not provided
    body: str = None     # Optional, will use default if not provided

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/suggestions")
def get_suggestions(db: Session = Depends(get_db)):
    try:
        labs = db.query(models.Lab).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {e}")

    suggestions = []
    for lab in labs:
        if lab.domain and IDEAL_LABS["domain"] and lab.domain == IDEAL_LABS["domain"]:
            suggestions.append({
                "id": f"{IDEAL_LABS['id']}_{lab.id}",
                "from_lab_id": IDEAL_LABS["id"],
                "to_lab_id": lab.id,
                "from_lab": IDEAL_LABS["name"],
                "to_lab": lab.name or f"Lab {lab.id}",
                "shared_domain": lab.domain,
                "shared_fields": [r.field for r in lab.researchers if r.field] or ["Example field"]
            })
    return suggestions

# ✅ UPDATED: Use custom subject/body if provided
@router.post("/send-email")
def send_collaboration_email(req: EmailRequest, db: Session = Depends(get_db)):
    to_lab = db.query(models.Lab).filter(models.Lab.id == req.to_lab_id).first()

    if not to_lab:
        raise HTTPException(status_code=404, detail="Recipient lab not found")
    if not to_lab.email:
        raise HTTPException(status_code=400, detail="Recipient lab does not have an email")

    # Use custom subject/body if provided, otherwise use defaults
    subject = req.subject or f"Collaboration Proposal from {IDEAL_LABS['name']}"
    
    body = req.body or f"""
Hello {to_lab.name} Team,

We at {IDEAL_LABS['name']} noticed that our labs share expertise in {IDEAL_LABS['domain']}.
We would like to explore potential collaboration opportunities with your team.

Please let us know if you are interested.

Best regards,
{IDEAL_LABS['name']} Team
"""

    FROM_EMAIL = os.getenv("SMTP_EMAIL")
    EMAIL_PASSWORD = os.getenv("SMTP_PASSWORD")

    if not FROM_EMAIL or not EMAIL_PASSWORD:
        raise HTTPException(status_code=500, detail="Email credentials not configured")

    send_email(to_lab.email, subject, body, FROM_EMAIL, EMAIL_PASSWORD)

    return {"status": "sent", "to": to_lab.email, "subject": subject}