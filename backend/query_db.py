import sys
from pathlib import Path

backend_root = Path(__file__).resolve().parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.config.db import get_db_connection

def query_schema():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect!")
        return

    cursor = conn.cursor()
    try:
        user_id = 105
        print(f"--- RUNNING ANALYTICS TEST FOR USER_ID {user_id} ---")
        
        # Monthly bar query
        bar_sql = """
            SELECT
                TO_CHAR(transaction_date, 'Mon YYYY') AS label,
                SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) AS income,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense
            FROM transactions
            WHERE user_id = :u_id
              AND transaction_date >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -11)
            GROUP BY TRUNC(transaction_date, 'MM'), TO_CHAR(transaction_date, 'Mon YYYY')
            ORDER BY TRUNC(transaction_date, 'MM')
        """
        print("Executing monthly query...")
        cursor.execute(bar_sql, u_id=user_id)
        rows = cursor.fetchall()
        print("Monthly rows:", rows)

        # Pie query
        pie_sql = """
            SELECT category, SUM(amount) AS total
            FROM transactions
            WHERE user_id = :u_id
              AND type = 'EXPENSE'
              AND transaction_date >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -11)
            GROUP BY category
            ORDER BY total DESC
        """
        print("Executing pie query...")
        cursor.execute(pie_sql, u_id=user_id)
        pie_rows = cursor.fetchall()
        print("Pie rows:", pie_rows)

        # Totals query
        totals_sql = """
            SELECT
                SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS total_expense
            FROM transactions
            WHERE user_id = :u_id
              AND transaction_date >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -11)
        """
        print("Executing totals query...")
        cursor.execute(totals_sql, u_id=user_id)
        totals_row = cursor.fetchone()
        print("Totals row:", totals_row)

    except Exception as e:
        print("Error:", e)
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    query_schema()



