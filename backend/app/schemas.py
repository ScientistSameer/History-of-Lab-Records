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
    domain: Optional[str] = None
    description: Optional[str] = None
    email: Optional[EmailStr] = None

class LabCreate(LabBase):
    pass

class LabResponse(LabBase):
    id: int

    class Config:
        from_attributes = True


# ======================
# Researchers
# ======================
class ResearcherBase(BaseModel):
    name: str
    field: Optional[str] = None
    lab_id: int

class ResearcherCreate(ResearcherBase):
    pass

class ResearcherResponse(ResearcherBase):
    id: int

    class Config:
        from_attributes = True
        