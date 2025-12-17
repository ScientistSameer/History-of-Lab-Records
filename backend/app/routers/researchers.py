from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, models, schemas

router = APIRouter(prefix="/researchers", tags=["Researchers"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Get all researchers
@router.get("/", response_model=list[schemas.ResearcherResponse])
def get_researchers(db: Session = Depends(get_db)):
    return db.query(models.Researcher).all()


# Create a researcher
@router.post("/", response_model=schemas.ResearcherResponse)
def create_researcher(researcher: schemas.ResearcherBase, db: Session = Depends(get_db)):
    db_researcher = models.Researcher(**researcher.dict())
    db.add(db_researcher)
    db.commit()
    db.refresh(db_researcher)
    return db_researcher


# Get researchers by lab
@router.get("/by-lab/{lab_id}", response_model=list[schemas.ResearcherResponse])
def get_researchers_by_lab(lab_id: int, db: Session = Depends(get_db)):
    return db.query(models.Researcher).filter(models.Researcher.lab_id == lab_id).all()


# Get summary: number of researchers per lab
@router.get("/summary")
def get_researchers_summary(db: Session = Depends(get_db)):
    labs = db.query(models.Lab).all()
    researchers = db.query(models.Researcher).all()

    total_researchers = len(researchers)
    total_seniors = sum(1 for r in researchers if (r.seniority or "").lower() == "senior")
    total_phd = sum(1 for r in researchers if (r.seniority or "").lower() == "phd")
    total_interns = sum(1 for r in researchers if (r.seniority or "").lower() == "intern")
    total_projects = sum(r.projects or 0 for r in researchers)

    labs_summary = []

    for lab in labs:
        lab_researchers = [r for r in researchers if r.lab_id == lab.id]

        labs_summary.append({
            "lab_id": lab.id,
            "lab_name": lab.name,
            "total": len(lab_researchers),
            "seniors": sum(1 for r in lab_researchers if (r.seniority or "").lower() == "senior"),
            "phd": sum(1 for r in lab_researchers if (r.seniority or "").lower() == "phd"),
            "interns": sum(1 for r in lab_researchers if (r.seniority or "").lower() == "intern"),
            "projects": sum(r.projects or 0 for r in lab_researchers),
        })

    return {
        "total_researchers": total_researchers,
        "total_seniors": total_seniors,
        "total_phd": total_phd,
        "total_interns": total_interns,
        "total_projects": total_projects,
        "labs": labs_summary
    }
