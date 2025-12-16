from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/collaboration", tags=["Collaboration"])

# Dummy in-memory data (MVP)
collaborations = [
    {
        "id": 1,
        "labs": "AI Lab ↔ Computer Vision Lab",
        "status": "Recommended",
        "score": 92
    },
    {
        "id": 2,
        "labs": "Bioinformatics Lab ↔ Genetics Lab",
        "status": "Pending",
        "score": 88
    }
]

emails = []

@router.get("/")
def get_collaborations():
    return [
        {
            "id": 1,
            "from_lab": "AI Lab",
            "to_lab": "Computer Vision Lab",
            "score": 92
        },
        {
            "id": 2,
            "from_lab": "Bioinformatics Lab",
            "to_lab": "Genetics Lab",
            "score": 88
        }
    ]


@router.post("/generate-email")
def generate_email(payload: dict):
    content = f"""
Hello,

We identified a strong collaboration opportunity between
{payload['from_lab']} and {payload['to_lab']}.

Regards,
Atlas System
"""
    email = {
        "id": len(emails) + 1,
        "from_lab": payload["from_lab"],
        "to_lab": payload["to_lab"],
        "subject": "Collaboration Opportunity",
        "content": content,
        "created_at": datetime.utcnow()
    }
    emails.append(email)
    return email


@router.get("/emails")
def get_emails():
    return emails