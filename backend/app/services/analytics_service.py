# backend/app/services/analytics_service.py
# NEW FILE — queries the existing TRANSACTIONS table directly
from app.config.db import get_db_connection


def get_analytics_summary_from_db(user_id: int, period: str) -> dict:
    """
    Reads directly from the existing TRANSACTIONS table.
    Returns bar chart data (income vs expense per period bucket),
    pie chart data (expense breakdown by category), and summary totals.
    period: 'daily' | 'weekly' | 'monthly'
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return _empty_response()

        cursor = conn.cursor()

        # Determine start date filter based on period
        if period == 'daily':
            date_filter = "transaction_date >= TRUNC(SYSDATE) - 30"
        elif period == 'weekly':
            date_filter = "transaction_date >= TRUNC(SYSDATE) - 84"
        else: # monthly
            date_filter = "transaction_date >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -11)"

        # ── 1. Bar / Line chart data ─────────────────────────────────────────
        if period == 'daily':
            # Last 30 days, grouped by day
            bar_sql = """
                SELECT
                    TO_CHAR(transaction_date, 'DD Mon') AS label,
                    SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) AS income,
                    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense
                FROM transactions
                WHERE user_id = :u_id
                  AND transaction_date >= TRUNC(SYSDATE) - 30
                GROUP BY TRUNC(transaction_date, 'DD'), TO_CHAR(transaction_date, 'DD Mon')
                ORDER BY TRUNC(transaction_date, 'DD')
            """
        elif period == 'weekly':
            # Last 12 weeks, grouped by ISO week
            bar_sql = """
                SELECT
                    'Week ' || TO_CHAR(TRUNC(transaction_date, 'IW'), 'WW') AS label,
                    SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) AS income,
                    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense
                FROM transactions
                WHERE user_id = :u_id
                  AND transaction_date >= TRUNC(SYSDATE) - 84
                GROUP BY TRUNC(transaction_date, 'IW'), TO_CHAR(TRUNC(transaction_date, 'IW'), 'WW')
                ORDER BY TRUNC(transaction_date, 'IW')
            """
        else:  # monthly
            # Last 12 months
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

        cursor.execute(bar_sql, u_id=user_id)
        bar_rows = cursor.fetchall()
        chart_data = [
            {"name": r[0], "income": float(r[1]), "expense": float(r[2])}
            for r in bar_rows
        ]

        # ── 2. Pie chart — expense breakdown by category ────────────────────
        pie_sql = f"""
            SELECT category, SUM(amount) AS total
            FROM transactions
            WHERE user_id = :u_id
              AND type = 'EXPENSE'
              AND {date_filter}
            GROUP BY category
            ORDER BY total DESC
        """
        cursor.execute(pie_sql, u_id=user_id)
        pie_rows = cursor.fetchall()

        PIE_COLORS = ['#0A1128', '#2563eb', '#60a5fa', '#bfdbfe',
                      '#93c5fd', '#1d4ed8', '#3b82f6', '#dbeafe']
        pie_data = [
            {"name": r[0], "value": float(r[1]), "color": PIE_COLORS[i % len(PIE_COLORS)]}
            for i, r in enumerate(pie_rows)
        ]

        # ── 3. Summary totals ────────────────────────────────────────────────
        totals_sql = f"""
            SELECT
                SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS total_expense
            FROM transactions
            WHERE user_id = :u_id
              AND {date_filter}
        """
        cursor.execute(totals_sql, u_id=user_id)
        tot = cursor.fetchone()
        total_income  = float(tot[0]) if tot and tot[0] else 0.0
        total_expense = float(tot[1]) if tot and tot[1] else 0.0
        net_savings   = total_income - total_expense

        return {
            "period": period,
            "chart_data": chart_data,
            "pie_data": pie_data,
            "summary": {
                "total_income": total_income,
                "total_expense": total_expense,
                "net_savings": net_savings,
            },
        }

    except Exception as e:
        print(f"[Analytics] Error fetching summary: {e}")
        return _empty_response()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def get_transactions_for_pdf(user_id: int) -> dict:
    """
    Fetches all transaction rows + totals needed to render the PDF report.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return {"transactions": [], "summary": {}}

        cursor = conn.cursor()

        # All transactions for this user, newest first
        cursor.execute("""
            SELECT transaction_id, description, category, amount, type,
                   TO_CHAR(transaction_date, 'YYYY-MM-DD') AS tx_date
            FROM transactions
            WHERE user_id = :u_id
            ORDER BY transaction_date DESC
        """, u_id=user_id)
        rows = cursor.fetchall()

        transactions = [
            {
                "id": r[0],
                "title": r[1],
                "category": r[2],
                "amount": float(r[3]),
                "type": r[4],
                "date": r[5],
            }
            for r in rows
        ]

        # Overall totals
        cursor.execute("""
            SELECT
                SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END),
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END),
                COUNT(*)
            FROM transactions
            WHERE user_id = :u_id
        """, u_id=user_id)
        t = cursor.fetchone()
        income = float(t[0]) if t and t[0] else 0.0
        expense = float(t[1]) if t and t[1] else 0.0

        return {
            "transactions": transactions,
            "summary": {
                "total_income":  income,
                "total_expense": expense,
                "net_savings":   income - expense,
                "total_count":   int(t[2]) if t else 0,
            },
        }

    except Exception as e:
        print(f"[Analytics] Error fetching PDF data: {e}")
        return {"transactions": [], "summary": {}}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def _empty_response():
    return {
        "period": "",
        "chart_data": [],
        "pie_data": [],
        "summary": {"total_income": 0, "total_expense": 0, "net_savings": 0},
    }