from app.config.db import get_db_connection
import logging

logger = logging.getLogger(__name__)


def get_portfolio_history(user_id: int, timeframe: str):
    conn = None
    cursor = None
    result_cursor = None

    try:
        conn = get_db_connection()
        if not conn:
            return []

        cursor = conn.cursor()
        result_cursor = conn.cursor()

        cursor.callproc(
            "get_portfolio_history_proc",
            [user_id, timeframe, result_cursor]
        )

        rows = result_cursor.fetchall()

        return [
            {
                "record_date": str(row[0]),
                "portfolio_value": float(row[1] or 0)
            }
            for row in rows
        ]

    except Exception as e:
        logger.error(f"[ERROR] get_portfolio_history: {str(e)}")
        return []

    finally:
        if result_cursor:
            result_cursor.close()
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def get_user_assets(user_id: int):
    conn = None
    cursor = None
    result_cursor = None

    try:
        conn = get_db_connection()
        if not conn:
            return []

        cursor = conn.cursor()
        result_cursor = conn.cursor()

        cursor.callproc(
            "get_user_assets_proc",
            [user_id, result_cursor]
        )

        rows = result_cursor.fetchall()

        return [
            {
                "id": r[0],
                "asset_name": r[1],
                "asset_type": r[2],
                "current_value": float(r[3] or 0),
                "growth_percentage": float(r[4] or 0)
            }
            for r in rows
        ]

    except Exception as e:
        logger.error(f"[ERROR] get_user_assets: {str(e)}")
        return []

    finally:
        if result_cursor:
            result_cursor.close()
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def add_asset(user_id: int, data):
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        if not conn:
            return None

        cursor = conn.cursor()
        new_id = cursor.var(int)

        cursor.callproc(
            "add_asset_proc",
            [
                user_id,
                data.asset_name,
                data.asset_type,
                data.current_value,
                data.growth_percentage,
                new_id
            ]
        )

        conn.commit()
        return new_id.getvalue() is not None

    except Exception as e:
        logger.error(f"[ERROR] add_asset: {str(e)}")
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def update_asset(asset_id: int, user_id: int, data):
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        if not conn:
            return False, "Database connection failed"

        cursor = conn.cursor()
        rows_affected = cursor.var(int)

        cursor.callproc(
            "update_asset_proc",
            [
                asset_id,
                user_id,
                data.asset_name,
                data.asset_type,
                data.current_value,
                data.growth_percentage,
                rows_affected
            ]
        )

        conn.commit()
        return (rows_affected.getvalue() or 0) > 0, None

    except Exception as e:
        logger.error(f"[ERROR] update_asset: {str(e)}")
        return False, str(e)

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def delete_asset(asset_id: int, user_id: int):
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        if not conn:
            return False

        cursor = conn.cursor()
        rows_affected = cursor.var(int)

        cursor.callproc(
            "delete_asset_proc",
            [asset_id, user_id, rows_affected]
        )

        conn.commit()
        return (rows_affected.getvalue() or 0) > 0

    except Exception as e:
        logger.error(f"[ERROR] delete_asset: {str(e)}")
        return False

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()