from fastapi import APIRouter, Depends, HTTPException
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
    # Ensure required fields for collaboration are filled
    if not lab.email or not lab.collaboration_interests:
        raise HTTPException(status_code=400, detail="Email and Collaboration Interests are required")
    return crud.create_lab(db, lab)


# Update lab
@router.put("/{lab_id}", response_model=schemas.LabResponse)
def update_lab(lab_id: int, lab: schemas.LabCreate, db: Session = Depends(get_db)):
    updated = crud.update_lab(db, lab_id, lab)
    if not updated:
        raise HTTPException(status_code=404, detail="Lab not found")
    return updated

# Delete lab
@router.delete("/{lab_id}", response_model=schemas.LabResponse)
def delete_lab(lab_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_lab(db, lab_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Lab not found")
    return deleted