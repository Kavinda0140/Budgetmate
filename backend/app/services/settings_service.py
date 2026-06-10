from app.config.db import get_db_connection
from app.schemas.settings import ProfileUpdate
from app.utils.security import hash_password, verify_password
import logging

logger = logging.getLogger(__name__)


def get_profile(user_id: int):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return "ERROR"

        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT full_name, email, profile_photo
            FROM Users
            WHERE id = ?
            """,
            (user_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None

        return {
            "full_name": row[0],
            "email": row[1],
            "profile_photo": row[2],
        }
    except Exception as e:
        logger.error(f"[ERROR] Load profile failed: {str(e)}")
        return "ERROR"
    finally:
        if conn:
            if cursor:
                cursor.close()
            conn.close()


def update_profile(user_id: int, data: ProfileUpdate):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return False

        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE Users
            SET full_name = ?,
                profile_photo = ?
            WHERE id = ?
            """,
            (data.full_name, data.profile_photo, user_id)
        )
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        logger.error(f"[ERROR] Update profile failed: {str(e)}")
        return False
    finally:
        if conn:
            if cursor:
                cursor.close()
            conn.close()


def change_password(user_id: int, current_password: str, new_password: str):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return "ERROR"

        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT password_hash
            FROM Users
            WHERE id = ?
            """,
            (user_id,)
        )
        row = cursor.fetchone()
        if not row:
            return "NOT_FOUND"

        stored_hash = row[0]
        if not verify_password(current_password, stored_hash):
            return "INVALID_CURRENT_PASSWORD"

        new_hash = hash_password(new_password)
        cursor.execute(
            """
            UPDATE Users
            SET password_hash = ?
            WHERE id = ?
            """,
            (new_hash, user_id)
        )
        conn.commit()
        return "SUCCESS"
    except Exception as e:
        logger.error(f"[ERROR] Change password failed: {str(e)}")
        return "ERROR"
    finally:
        if conn:
            if cursor:
                cursor.close()
            conn.close()