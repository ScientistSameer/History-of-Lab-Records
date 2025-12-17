from fastapi import APIRouter, UploadFile, File
import re

router = APIRouter(prefix="/ingest", tags=["Document Ingestion"])

@router.post("/document")
async def ingest_document(file: UploadFile = File(...)):
    content = (await file.read()).decode("utf-8", errors="ignore")

    keywords = extract_keywords(content)

    return {
        "extracted_domains": keywords,
        "message": "Use these keywords to create lab profile"
    }

def extract_keywords(text: str):
    possible_domains = [
        "AI", "Machine Learning", "Data Science",
        "Robotics", "Cybersecurity", "Networks",
        "Bioinformatics", "Cloud", "IoT"
    ]

    found = []
    text_lower = text.lower()

    for domain in possible_domains:
        if domain.lower() in text_lower:
            found.append(domain)

    return found
