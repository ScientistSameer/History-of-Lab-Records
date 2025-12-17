from fastapi import APIRouter, UploadFile, File, HTTPException
import re
import io

import pdfplumber
from docx import Document

router = APIRouter(prefix="/ingest", tags=["Document Ingestion"])


@router.post("/document")
async def ingest_document(file: UploadFile = File(...)):
    """
    Accepts TXT / PDF / DOCX
    Extracts LabCreate-compatible fields from paragraphs
    Returns extracted data WITHOUT saving
    """

    filename = file.filename.lower()

    try:
        raw = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to read document")

    # ----------------
    # Extract text by type
    # ----------------
    if filename.endswith(".txt"):
        text = raw.decode("utf-8", errors="ignore")
    elif filename.endswith(".docx"):
        text = extract_docx_text(raw)
    elif filename.endswith(".pdf"):
        text = extract_pdf_text(raw)
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload TXT, PDF, or DOCX."
        )

    if not text or len(text.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from document"
        )

    text_lower = text.lower()

    # ----------------
    # Extract fields
    # ----------------
    extracted = {
        # Core identity
        "name": extract_lab_name(text),
        "description": extract_description(text),
        "lab_type": extract_lab_type(text_lower),

        # Domains
        "domain": extract_primary_domain(text_lower),
        "sub_domains": extract_sub_domains(text_lower),
        "preferred_domains": extract_preferred_domains(text_lower),

        # Workforce (FIX #1)
        "total_researchers": extract_total_researchers(text),
        "senior_researchers": extract_senior_researchers(text),
        "phd_students": extract_phd_students(text),
        "interns": extract_interns(text),

        # Projects (FIX #2 & #3)
        "active_projects": extract_integer(
            text_lower,
            ["ongoing projects", "active projects", "managing"]
        ),
        "max_project_capacity": extract_integer(
            text_lower,
            ["capacity to handle", "maximum projects", "up to"]
        ),

        # Operations
        "workload_score": extract_integer(text_lower, ["workload score"]),
        "availability_status": extract_availability(text_lower),

        # Resources (FIX #6)
        "equipment_level": extract_level(text_lower, "equipment"),
        "funding_level": extract_level(text_lower, "funding"),
        "computing_resources": extract_computing(text_lower),

        # Collaboration
        "collaboration_interests": extract_collaboration(text_lower),

        # Contact
        "email": extract_email(text),
        "website": extract_website(text),

        # Location (FIX #4 & #5)
        "country": extract_field(text, "country"),
        "city": extract_field(text, "city"),
        "institute": extract_field(text, "institute"),

        "data_source": "document"
    }

    return {
        "extracted_lab": extracted,
        "confidence": "medium",
        "message": "Please review and confirm extracted lab details"
    }


# =================================================
# File Type Extractors
# =================================================

def extract_docx_text(raw: bytes) -> str:
    doc = Document(io.BytesIO(raw))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def extract_pdf_text(raw: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(raw)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


# =================================================
# Extraction Helpers
# =================================================

def extract_lab_name(text: str):
    """
    Heuristic:
    - First 5 lines
    - No email / URL
    - Short, title-like
    """
    for line in text.splitlines()[:5]:
        clean = line.strip()
        if not clean:
            continue
        if "@" in clean or "http" in clean.lower():
            continue
        if len(clean.split()) > 12:
            continue
        if clean[0].isupper():
            return clean
    return None


def extract_description(text: str):
    paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 50]
    return paragraphs[0] if paragraphs else None


def extract_primary_domain(text_lower: str):
    for d in domain_keywords():
        if d.lower() in text_lower:
            return d
    return None


def extract_sub_domains(text_lower: str):
    found = [d for d in domain_keywords() if d.lower() in text_lower]
    return ", ".join(found) if found else None


def extract_preferred_domains(text_lower: str):
    if "preferred domains" in text_lower or "open to collaboration" in text_lower:
        return extract_sub_domains(text_lower)
    return None


def extract_lab_type(text_lower: str):
    match = re.search(r"(research laboratory|laboratory|lab|institute)", text_lower)
    return match.group(0).title() if match else None


# ------------------------
# Workforce Extractors
# ------------------------

def extract_total_researchers(text: str):
    """
    Extracts total researchers from patterns like:
    "X researchers in total"
    """
    match = re.search(r"(\d+)\s+researchers\s+in\s+total", text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    # fallback: sum of all roles
    total = (
        extract_senior_researchers(text) +
        extract_phd_students(text) +
        extract_interns(text)
    )
    return total if total else 0


def extract_senior_researchers(text: str):
    match = re.search(r"(\d+)\s+senior\s+researchers", text, re.IGNORECASE)
    return int(match.group(1)) if match else 0


def extract_phd_students(text: str):
    match = re.search(r"(\d+)\s+(PhD|Ph\.D|phd)\s+(scholars|students)", text, re.IGNORECASE)
    return int(match.group(1)) if match else 0


def extract_interns(text: str):
    match = re.search(r"(\d+)\s+(research\s+)?interns", text, re.IGNORECASE)
    return int(match.group(1)) if match else 0

def extract_integer(text_lower: str, keywords: list[str]):
    for k in keywords:
        pattern1 = rf"{k}\D*(\d+)"
        pattern2 = rf"(\d+)\D*{k}"
        match = re.search(pattern1, text_lower)
        if match:
            return int(match.group(1))
        match = re.search(pattern2, text_lower)
        if match:
            return int(match.group(1))
    return 0


# FIX #6 – context-aware level extraction
def extract_level(text_lower: str, keyword: str):
    pattern = rf"{keyword}.*?(high|medium|low)"
    match = re.search(pattern, text_lower)
    return match.group(1) if match else None


def extract_computing(text_lower: str):
    resources = []
    if "gpu" in text_lower:
        resources.append("GPU")
    if "cloud" in text_lower:
        resources.append("Cloud")
    if "hpc" in text_lower or "cluster" in text_lower:
        resources.append("HPC")
    return ", ".join(resources) if resources else None


def extract_collaboration(text_lower: str):
    if "collaborat" in text_lower or "partner" in text_lower:
        return "Open to collaboration"
    return None


def extract_email(text: str):
    match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match.group(0) if match else None


# FIX #7 – trim punctuation
def extract_website(text: str):
    match = re.search(r"https?://[^\s\)\]\}]+", text)
    return match.group(0).rstrip(".") if match else None


def extract_field(text: str, field_name: str):
    # Labeled format
    labeled = rf"{field_name}\s*[:\-]\s*(.+)"
    match = re.search(labeled, text, re.IGNORECASE)
    if match:
        return match.group(1).strip()

    text_lower = text.lower()

    # Country
    if field_name.lower() == "country":
        match = re.search(r"\b(usa|uk|canada|germany|france|india|pakistan)\b", text_lower)
        return match.group(1).upper() if match else None

    # FIX #4 – City
    if field_name.lower() == "city":
        match = re.search(r"in\s+([A-Z][a-zA-Z\s]+),\s*(USA|UK|Canada|Pakistan)", text)
        if match:
            return match.group(1).strip()

    # FIX #5 – Institute
    if field_name.lower() == "institute":
        match = re.search(
            r"(at|under)\s+(the\s+)?([A-Z][a-zA-Z\s]+University)",
            text
        )
        if match:
            return match.group(3).strip()

    return None


def extract_availability(text_lower: str):
    if "available" in text_lower:
        return "Available"
    if "unavailable" in text_lower:
        return "Unavailable"
    return None


def domain_keywords():
    return [
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Robotics",
        "Cybersecurity",
        "Networks",
        "Bioinformatics",
        "Cloud Computing",
        "Internet of Things",
        "Computer Vision",
        "Natural Language Processing"
    ]
