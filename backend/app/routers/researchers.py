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
    summary = []
    for lab in labs:
        summary.append({
            "lab_id": lab.id,
            "lab_name": lab.name,
            "researchers_count": len(lab.researchers)
        })
    total_researchers = db.query(models.Researcher).count()
    return {"total_researchers": total_researchers, "labs": summary}
