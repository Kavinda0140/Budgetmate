from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.utils.security import get_current_user
from app.services.investment_service import (
    get_portfolio_history,
    get_user_assets,
    add_asset,
    update_asset,
    delete_asset
)
from app.schemas.investment import AssetCreate, AssetUpdate, AssetResponse

router = APIRouter()


# --- 1. Get History (Chart Data) ---
@router.get("/history")
def investment_history(timeframe: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    return get_portfolio_history(user_id, timeframe)


# --- 2. List Active Assets ---
@router.get("/assets", response_model=List[AssetResponse])
def list_assets(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    return get_user_assets(user_id)


# --- 3. Add Asset ---
@router.post("/assets", status_code=201)
def create_asset(data: AssetCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    success = add_asset(user_id, data)
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to add asset"
        )
    return {
        "message": "Asset added successfully"
    }


# --- 4. Update Asset ---
@router.put("/assets/{asset_id}")
def modify_asset(asset_id: int, data: AssetUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    success, error = update_asset(asset_id, user_id, data)

    if error is not None:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update asset: {error}"
        )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    return {
        "message": "Asset updated successfully"
    }


# --- 5. Delete Asset ---
@router.delete("/assets/{asset_id}", status_code=204)
def remove_asset(asset_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    success = delete_asset(asset_id, user_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )