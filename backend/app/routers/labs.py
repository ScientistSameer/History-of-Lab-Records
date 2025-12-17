from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas, database

router = APIRouter(prefix="/labs", tags=["Labs"])

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------
# Get all labs
# ----------------------
@router.get("/", response_model=list[schemas.LabResponse])
def read_labs(db: Session = Depends(get_db)):
    return crud.get_labs(db)


# ----------------------
# Create lab (WITH EMAIL)
# ----------------------
@router.post("/", response_model=schemas.LabResponse)
def create_lab(lab: schemas.LabCreate, db: Session = Depends(get_db)):
    return crud.create_lab(db, lab)
