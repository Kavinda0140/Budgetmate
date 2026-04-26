from app.config.db import get_db_connection
from app.utils.security import hash_password, verify_password, create_access_token, send_reset_email
import secrets
from datetime import datetime, timedelta
import logging

# Logging setup
logger = logging.getLogger(__name__)

# --- 1. User Registration ---
def register_user(full_name, email, password):
    clean_email = email.strip().lower()
    hashed_pw = hash_password(password)
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        p_status = cursor.var(str)
        
        cursor.callproc("register_user_proc", [full_name, clean_email, hashed_pw, p_status])
        status = p_status.getvalue()
        conn.commit()
        return status
    except Exception as e:
        logger.error(f"❌ Registration Error: {str(e)}")
        return "ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- 2. User Login ---
def authenticate_user(email, password):
    clean_email = email.strip().lower()
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        p_hash, p_id, p_name, p_status = cursor.var(str), cursor.var(int), cursor.var(str), cursor.var(str)
        
        cursor.callproc("login_user_proc", [clean_email, p_hash, p_id, p_name, p_status])
        
        if p_status.getvalue() == "SUCCESS" and verify_password(password, p_hash.getvalue()):
            token = create_access_token({"sub": clean_email, "user_id": p_id.getvalue()})
            return {"access_token": token, "token_type": "bearer", "user": p_name.getvalue()}, "SUCCESS"
        
        return None, "FAILED"
    except Exception as e:
        logger.error(f"❌ Login Error: {str(e)}")
        return None, "ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- 3. Forgot Password (OTP Logic) ---
def forgot_password_logic(email: str) -> str:
    clean_email = email.strip().lower()
    
    #  generate a secure 6-digit OTP
    otp = str(secrets.randbelow(900000) + 100000)
    expiry = datetime.now() + timedelta(minutes=10)
    
    print(f"🔍 DEBUG: Generated OTP: {otp} for '{clean_email}'")
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        p_status = cursor.var(str)
        p_error_msg = cursor.var(str)
        
        cursor.callproc("STORE_RESET_TOKEN_PROC", [clean_email, otp, expiry, p_status, p_error_msg])
        
        status = p_status.getvalue()
        if status == "SUCCESS":
            if send_reset_email(clean_email, otp):
                conn.commit()
                print(f"✅ DEBUG: OTP sent to {clean_email}")
                return "SUCCESS"
            else:
                return "EMAIL_FAILED"
        
        return "FAILED"
    except Exception as e:
        print(f"🔥 DEBUG: Error in Forgot Password: {str(e)}")
        return "INTERNAL_ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()

# --- 4. Reset Password ---
def reset_password_logic(email, otp, new_password):
    clean_email = email.strip().lower()
    # hash the new password before sending it to the database
    hashed_pw = hash_password(new_password)
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        p_status = cursor.var(str)
        
        # [Email, OTP, HashedPassword, Status]
        cursor.callproc("reset_password_proc", [clean_email, otp, hashed_pw, p_status])
        
        status = p_status.getvalue()
        
        print(f"🔍 DEBUG: Reset Status from DB: {status}")
        
        conn.commit()
        return status
    except Exception as e:
        print(f"🔥 DEBUG: Critical Reset Error - {str(e)}")
        return "ERROR"
    finally:
        if conn:
            cursor.close()
            conn.close()