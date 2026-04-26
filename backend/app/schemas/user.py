from pydantic import BaseModel, EmailStr, Field

# --- 1. User Registration Schema ---
class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

# --- 2. User Login Schema ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- 3. API Response Schema ---
class UserResponse(BaseModel):
    message: str
    email: str

    class Config:
        from_attributes = True

# --- 4. Forgot Password Request (OTP Request) ---
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

# --- 5. Reset Password Request (OTP Verification) ---
class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6) 
    new_password: str = Field(..., min_length=6)