# routers/ideal_lab.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from pydantic import BaseModel

router = APIRouter(prefix="/ideal-lab", tags=["IDEAL Lab"])

# Pydantic schema
class IdealLabSchema(BaseModel):
    name: str
    description: str = ""
    domain: str = ""
    sub_domains: str = ""
    lab_type: str = ""
    email: str = ""
    website: str = ""
    country: str = ""
    city: str = ""
    institute: str = ""
    total_researchers: int = 0
    active_projects: int = 0
    max_project_capacity: int = 0
    workload_score: int = 0
    availability_status: str = ""
    senior_researchers: int = 0
    phd_students: int = 0
    interns: int = 0
    equipment_level: str = ""
    computing_resources: str = ""
    funding_level: str = ""
    collaboration_interests: str = ""
    preferred_domains: str = ""
    collaboration_history_count: int = 0
    openness_score: int = 0
    verified: bool = True

    class Config:
        orm_mode = True

# DB dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get IDEAL Lab data
@router.get("/", response_model=IdealLabSchema)
def get_ideal_lab(db: Session = Depends(get_db)):
    lab = db.query(models.IdealLab).first()
    if not lab:
        # create default record if not exists
        lab = models.IdealLab(name="IDEAL Labs", domain="Artificial Intelligence")
        db.add(lab)
        db.commit()
        db.refresh(lab)
    return lab

# Update IDEAL Lab data
@router.put("/", response_model=IdealLabSchema)
def update_ideal_lab(data: IdealLabSchema, db: Session = Depends(get_db)):
    lab = db.query(models.IdealLab).first()
    if not lab:
        raise HTTPException(status_code=404, detail="IDEAL Lab not found")
    
    for key, value in data.dict().items():
        setattr(lab, key, value)
    db.commit()
    db.refresh(lab)
    return lab
