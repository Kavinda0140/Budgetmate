from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.settings import ProfileResponse, ProfileUpdate, ChangePasswordRequest
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


@router.put("/change-password")
def change_password(data: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    result = settings_service.change_password(
        current_user["user_id"],
        data.current_password,
        data.new_password,
    )

    if result == "SUCCESS":
        return {"message": "Password updated successfully"}

    if result == "INVALID_CURRENT_PASSWORD":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    if result == "NOT_FOUND":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update password")