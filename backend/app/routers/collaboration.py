from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from pydantic import BaseModel
from ..email import send_email
import os

router = APIRouter(prefix="/collaboration", tags=["Collaboration"])

# -----------------------------
# Pydantic schema for email
# -----------------------------
class EmailRequest(BaseModel):
    from_lab_id: int
    to_lab_id: int

# -----------------------------
# DB dependency
# -----------------------------
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# Collaboration Suggestions
# -----------------------------
@router.get("/suggestions")
def get_suggestions(db: Session = Depends(get_db)):
    try:
        labs = db.query(models.Lab).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {e}")

    suggestions = []
    for i in range(len(labs)):
        for j in range(i + 1, len(labs)):
            # Match on domain safely
            if labs[i].domain and labs[j].domain and labs[i].domain == labs[j].domain:
                suggestions.append({
                    "id": f"{labs[i].id}_{labs[j].id}",
                    "from_lab_id": labs[i].id,
                    "to_lab_id": labs[j].id,
                    "from_lab": labs[i].name or f"Lab {labs[i].id}",
                    "to_lab": labs[j].name or f"Lab {labs[j].id}",
                    "shared_domain": labs[i].domain,
                    "shared_fields": [r.field for r in labs[i].researchers if r.field] or ["Example field"]
                })
    return suggestions

# -----------------------------
# Send Collaboration Email
# -----------------------------
@router.post("/send-email")
def send_collaboration_email(req: EmailRequest, db: Session = Depends(get_db)):
    from_lab = db.query(models.Lab).filter(models.Lab.id == req.from_lab_id).first()
    to_lab = db.query(models.Lab).filter(models.Lab.id == req.to_lab_id).first()

    if not from_lab or not to_lab:
        raise HTTPException(status_code=404, detail="Labs not found")
    if not to_lab.email:
        raise HTTPException(status_code=400, detail="Recipient lab does not have an email")

    subject = f"Collaboration Proposal from {from_lab.name}"
    body = f"""
Hello {to_lab.name} Team,

We at {from_lab.name} noticed that our labs share expertise in {from_lab.domain}.
We would like to explore potential collaboration opportunities with your team.

Please let us know if you are interested.

Best regards,
{from_lab.name} Team
"""

    FROM_EMAIL = os.getenv("SMTP_EMAIL")
    EMAIL_PASSWORD = os.getenv("SMTP_PASSWORD")

    if not FROM_EMAIL or not EMAIL_PASSWORD:
        raise HTTPException(status_code=500, detail="Email credentials not configured")

    send_email(to_lab.email, subject, body, FROM_EMAIL, EMAIL_PASSWORD)

    return {"status": "sent", "to": to_lab.email, "subject": subject, "body": body}
