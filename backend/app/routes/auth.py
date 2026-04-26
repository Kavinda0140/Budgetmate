from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserCreate, UserLogin, ForgotPasswordRequest, ResetPasswordRequest
from app.services import auth_service

router = APIRouter(tags=["Authentication"])

# --- 1. Registration ---
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate):
    result = auth_service.register_user(user.full_name, user.email, user.password)
    if result == "SUCCESS":
        return {"message": "User registered successfully"}
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result)

# --- 2. Login ---
@router.post("/login")
def login(user: UserLogin):
    data, result = auth_service.authenticate_user(user.email, user.password)
    if result == "SUCCESS":
        return data
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

# --- 3. Forgot Password (OTP Request) ---
@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    result = auth_service.forgot_password_logic(request.email)
    if result == "SUCCESS":
        return {"message": "A 6-digit OTP has been sent to your email."}
    
    if result == "INTERNAL_ERROR":
        raise HTTPException(status_code=500, detail="Database connection error")
        
    raise HTTPException(status_code=404, detail="Email not found")

# --- 4. Reset Password (Verify OTP & Change Password) ---
@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    result = auth_service.reset_password_logic(
        request.email, 
        request.otp, 
        request.new_password
    )
    
    if result == "SUCCESS":
        return {"message": "Password has been reset successfully. You can now login with your new password."}
    
    raise HTTPException(status_code=400, detail="Invalid OTP or code has expired")

# --- 5. Logout ---
@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}