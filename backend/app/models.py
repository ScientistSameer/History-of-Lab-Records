from sqlalchemy import Column, Integer, String, Boolean, ForeignKey,  DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# --------------------
# Users
# --------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

# --------------------
# Labs
# --------------------
class Lab(Base):
    __tablename__ = "labs"

    id = Column(Integer, primary_key=True, index=True)

    # Identity
    name = Column(String, nullable=False)
    description = Column(String)
    domain = Column(String)
    sub_domains = Column(String)  # comma-separated
    lab_type = Column(String)
    email = Column(String)
    website = Column(String)
    country = Column(String)
    city = Column(String)
    institute = Column(String)

    # Capacity & workload
    total_researchers = Column(Integer, default=0)
    active_projects = Column(Integer, default=0)
    max_project_capacity = Column(Integer, default=0)
    workload_score = Column(Integer, default=0)
    availability_status = Column(String)

    # Human resources
    senior_researchers = Column(Integer, default=0)
    phd_students = Column(Integer, default=0)
    interns = Column(Integer, default=0)

    # Infrastructure
    equipment_level = Column(String)
    computing_resources = Column(String)
    funding_level = Column(String)

    # Collaboration (future AI)
    collaboration_interests = Column(String)
    preferred_domains = Column(String)
    collaboration_history_count = Column(Integer, default=0)
    openness_score = Column(Integer, default=0)

    # Metadata
    data_source = Column(String, default="manual")
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    researchers = relationship(
        "Researcher",
        back_populates="lab",
        cascade="all, delete-orphan"
    )

# --------------------
# Researchers
# --------------------
class Researcher(Base):
    __tablename__ = "researchers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    field = Column(String)
    lab_id = Column(Integer, ForeignKey("labs.id"))
    seniority = Column(String, default="Junior")
    projects = Column(Integer, default=0)
    publications = Column(Integer, default=0)
    experience_years = Column(Integer, default=0)
    email = Column(String)
    status = Column(String, default="Active")

    lab = relationship("Lab", back_populates="researchers")
    
    
class IdealLab(Base):
    __tablename__ = "ideal_lab"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    domain = Column(String, default="")
    sub_domains = Column(String, default="")
    lab_type = Column(String, default="")
    email = Column(String, default="")
    website = Column(String, default="")
    country = Column(String, default="")
    city = Column(String, default="")
    institute = Column(String, default="")

    # Capacity & workload
    total_researchers = Column(Integer, default=0)
    active_projects = Column(Integer, default=0)
    max_project_capacity = Column(Integer, default=0)
    workload_score = Column(Integer, default=0)
    availability_status = Column(String, default="")

    # Human resources
    senior_researchers = Column(Integer, default=0)
    phd_students = Column(Integer, default=0)
    interns = Column(Integer, default=0)

    # Infrastructure
    equipment_level = Column(String, default="")
    computing_resources = Column(String, default="")
    funding_level = Column(String, default="")

    # Collaboration
    collaboration_interests = Column(String, default="")
    preferred_domains = Column(String, default="")
    collaboration_history_count = Column(Integer, default=0)
    openness_score = Column(Integer, default=0)

    # Metadata
    data_source = Column(String, default="manual")
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())