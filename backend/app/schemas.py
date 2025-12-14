from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    class Config:
        orm_mode = True

class LabBase(BaseModel):
    name: str
    domain: Optional[str]
    description: Optional[str]

class LabResponse(LabBase):
    id: int
    class Config:
        orm_mode = True

class ResearcherBase(BaseModel):
    name: str
    field: Optional[str]
    lab_id: int

class ResearcherResponse(ResearcherBase):
    id: int
    class Config:
        orm_mode = True
