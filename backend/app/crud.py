from sqlalchemy.orm import Session
from . import models, schemas, auth

# Users
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Labs
def get_labs(db: Session):
    labs = db.query(models.Lab).all()
    results = []
    for lab in labs:
        results.append({
            "id": lab.id,
            "name": lab.name,
            "domain": lab.domain,
            "description": lab.description,
            "researcher_count": len(lab.researchers)
        })
    return results

def create_lab(db: Session, lab: schemas.LabBase):
    db_lab = models.Lab(**lab.dict())
    db.add(db_lab)
    db.commit()
    db.refresh(db_lab)
    return {
        "id": db_lab.id,
        "name": db_lab.name,
        "domain": db_lab.domain,
        "description": db_lab.description,
        "researcher_count": 0
    }