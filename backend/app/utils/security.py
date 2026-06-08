import os
import bcrypt
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
base_dir = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=base_dir / '.env')

# Configurations
SECRET_KEY = os.getenv("SECRET_KEY", "your-fallback-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# --- Password Hashing ---
def hash_password(password: str):
    byte_pwd = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hash_pw = bcrypt.hashpw(byte_pwd, salt)
    return hash_pw.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    byte_pwd = plain_password.encode('utf-8')
    byte_hash = hashed_password.encode('utf-8')
    return bcrypt.checkpw(byte_pwd, byte_hash)

# --- JWT Token Creation ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Email Sending Logic (OTP Version) ---
def send_reset_email(to_email, otp):
    email_addr = os.getenv("EMAIL_ADDRESS")
    email_pass = os.getenv("EMAIL_PASSWORD")

    msg = EmailMessage()
    msg['Subject'] = "BudgetMate - Password Reset OTP"
    msg['From'] = f"BudgetMate Security <{email_addr}>"
    msg['To'] = to_email
    
    
    msg.set_content(f"""
Hi,

You requested a password reset for your BudgetMate account. 
Your One-Time Password (OTP) is:

{otp}

This code is valid for 10 minutes. If you did not request this, please ignore this email.

Best regards,
BudgetMate Team
    """)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(email_addr, email_pass)
            smtp.send_message(msg)
        return True
    except Exception as e:
        print(f"❌ Email Sending Error: {e}")
        return False

# --- JWT Token Verification Dependency ---
security_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if email is None or user_id is None:
            raise credentials_exception
        return {"email": email, "user_id": user_id}
    except JWTError:
        raise credentials_exception