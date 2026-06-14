from pydantic import BaseModel
from typing import Optional

class AssetCreate(BaseModel):
    asset_name: str
    asset_type: str
    current_value: float
    growth_percentage: float

class AssetUpdate(BaseModel):
    asset_name: Optional[str] = None
    asset_type: Optional[str] = None
    current_value: Optional[float] = None
    growth_percentage: Optional[float] = None

class AssetResponse(BaseModel):
    id: int
    asset_name: str
    asset_type: str
    current_value: float
    growth_percentage: float

    class Config:
        from_attributes = True
