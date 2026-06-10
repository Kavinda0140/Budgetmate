from pydantic import BaseModel, Field
from typing import Optional


class ProfileResponse(BaseModel):
    full_name: str
    email: str
    profile_photo: Optional[str] = None


class ProfileUpdate(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    profile_photo: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)