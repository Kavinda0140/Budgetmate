from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.settings import ProfileResponse, ProfileUpdate
from app.services import settings_service
from app.utils.security import get_current_user

router = APIRouter(tags=["Settings"])


@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: dict = Depends(get_current_user)):
    result = settings_service.get_profile(current_user["user_id"])

    if result == "ERROR":
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load profile")

    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return result


@router.put("/profile", response_model=ProfileResponse)
def update_profile(data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    success = settings_service.update_profile(current_user["user_id"], data)

    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update profile")

    updated = settings_service.get_profile(current_user["user_id"])
    if updated in (None, "ERROR"):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Profile updated but could not be reloaded")

    return updated