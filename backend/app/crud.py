from sqlalchemy.orm import Session
from . import models, schemas, auth


# ======================
# Users
# ======================
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# ======================
# Labs (Identity)
# ======================
def create_lab(db: Session, lab: schemas.LabCreate):
    db_lab = models.Lab(
        name=lab.name,
        description=lab.description,
        domain=lab.domain,
        sub_domains=lab.sub_domains,
        lab_type=lab.lab_type,
        email=lab.email,
        website=lab.website,
        country=lab.country,
        city=lab.city,
        institute=lab.institute,
        total_researchers=lab.total_researchers,
        active_projects=lab.active_projects,
        max_project_capacity=lab.max_project_capacity,
        workload_score=lab.workload_score,
        availability_status=lab.availability_status,
        senior_researchers=lab.senior_researchers,
        phd_students=lab.phd_students,
        interns=lab.interns,
        equipment_level=lab.equipment_level,
        computing_resources=lab.computing_resources,
        funding_level=lab.funding_level,
        collaboration_interests=lab.collaboration_interests,
        preferred_domains=lab.preferred_domains,
        data_source=lab.data_source or "manual"
    )
    db.add(db_lab)
    db.commit()
    db.refresh(db_lab)
    return db_lab

def update_lab(db: Session, lab_id: int, lab: schemas.LabCreate):
    db_lab = db.query(models.Lab).filter(models.Lab.id == lab_id).first()
    if not db_lab:
        return None
    for field, value in lab.dict().items():
        setattr(db_lab, field, value)
    db.commit()
    db.refresh(db_lab)
    return db_lab

def delete_lab(db: Session, lab_id: int):
    db_lab = db.query(models.Lab).filter(models.Lab.id == lab_id).first()
    if not db_lab:
        return None
    db.delete(db_lab)
    db.commit()
    return db_lab


def get_labs(db: Session):
    return db.query(models.Lab).all()


def get_lab_by_id(db: Session, lab_id: int):
    return db.query(models.Lab).filter(models.Lab.id == lab_id).first()


# ======================
# Researchers
# ======================
def create_researcher(db: Session, researcher: schemas.ResearcherCreate):
    db_researcher = models.Researcher(**researcher.dict())
    db.add(db_researcher)
    db.commit()
    db.refresh(db_researcher)
    return db_researcher


def get_researchers_by_lab(db: Session, lab_id: int):
    return (
        db.query(models.Researcher)
        .filter(models.Researcher.lab_id == lab_id)
        .all()
    )
