from pydantic import BaseModel, EmailStr
from typing import Optional

# ======================
# Users
# ======================
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ======================
# Labs (Identity)
# ======================
class LabBase(BaseModel):
    name: str
    description: Optional[str] = None
    domain: Optional[str] = None
    sub_domains: Optional[str] = None
    lab_type: Optional[str] = None
    email: EmailStr  # required
    website: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    institute: Optional[str] = None

    total_researchers: int = 0
    active_projects: int = 0
    max_project_capacity: int = 0
    workload_score: int = 0
    availability_status: Optional[str] = None

    senior_researchers: int = 0
    phd_students: int = 0
    interns: int = 0

    equipment_level: Optional[str] = None
    computing_resources: Optional[str] = None
    funding_level: Optional[str] = None

    collaboration_interests: str  # required
    preferred_domains: Optional[str] = None
    data_source: str = "manual"


class LabCreate(LabBase):
    """Use this for POST /labs"""
    pass


class LabResponse(LabBase):
    id: int
    verified: bool

    class Config:
        from_attributes = True


# ======================
# Researchers
# ======================
class ResearcherBase(BaseModel):
    name: str
    field: Optional[str] = None
    lab_id: int
    seniority: Optional[str] = "Junior"
    projects: Optional[int] = 0
    publications: Optional[int] = 0
    experience_years: Optional[int] = 0
    email: Optional[str] = None
    status: Optional[str] = "Active"

class ResearcherCreate(ResearcherBase):
    pass

class ResearcherResponse(ResearcherBase):
    id: int
    class Config:
        from_attributes = True