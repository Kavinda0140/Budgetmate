from fastapi import APIRouter, Depends, HTTPException
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse
)
from app.services import subscription_service
from app.utils.security import get_current_user
from typing import List

router = APIRouter()


# --- GET /subscriptions/ ---
@router.get("/", response_model=List[SubscriptionResponse])
def list_subscriptions(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    subscriptions = subscription_service.get_subscriptions(user_id)
    return subscriptions


# --- POST /subscriptions/ ---
@router.post("/", status_code=201)
def create_subscription(data: SubscriptionCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    success = subscription_service.add_subscription(user_id, data)

    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to create subscription"
        )

    return {
        "message": "Subscription created"
    }


# --- PUT /subscriptions/{subscription_id} ---
@router.put("/{subscription_id}")
def modify_subscription(subscription_id: int, data: SubscriptionCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    success, error = subscription_service.update_subscription(subscription_id, user_id, data)

    if error is not None:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update subscription: {error}"
        )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )

    return {
        "message": "Subscription updated"
    }


# --- DELETE /subscriptions/{subscription_id} ---
@router.delete("/{subscription_id}", status_code=204)
def remove_subscription(subscription_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    success = subscription_service.delete_subscription(subscription_id, user_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found"
        )