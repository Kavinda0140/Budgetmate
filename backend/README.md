# BudgetMate Backend

This is the Python (FastAPI) backend for the BudgetMate expense tracking system. It provides RESTful APIs, handles authentication with JWT, and connects to an Oracle Cloud Autonomous Database.

## Setup Instructions for Teammates

### 1. Set up your Python Environment
It is recommended to use a virtual environment. Open a terminal in this `backend/` directory:

```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
# Activate it (Windows)
.\venv\Scripts\activate

# Install the required dependencies
pip install -r requirements.txt
```

### 2. Configure Oracle Database Wallet
This project connects to an Oracle Cloud Autonomous Database using the `oracledb` package in Thin mode.
1. Download the Database Connection Credentials (Wallet zip file) from the Oracle Cloud Console.
2. Extract the wallet files into the `backend/wallet/` directory (or configure `WALLET_LOCATION` in your `.env` to point to the directory containing `cwallet.sso`, `tnsnames.ora`, etc.).

### 3. Set up Environment Variables
Because passwords are ignored by Git, you need to create your own local `.env` file:
1. Copy the `backend/.env.example` file and rename the copy to `.env`.
2. Open the new `.env` file and fill in your actual database credentials, JWT secret, and email configurations (ask the team lead if unsure).

### 4. Set up the Database
If the Oracle Database tables, constraints, sequences, and stored procedures have not been created yet, run the setup scripts using your Oracle Database client/IDE (e.g., Oracle SQL Developer, PL/SQL Developer, or SQLcl):
1. Execute the main schema script `2026-06-11.sql` to drop any old tables, create the tables, views, sequences, and insert seed data.
2. Execute the `add_missing_oracle_procedures.sql` script to create the stored procedures and triggers required by the backend.

### 5. Run the Server
Start the development server using the main module:
```bash
python -m app.main
```

Alternatively, you can run it directly with Uvicorn:
```bash
uvicorn app.main:app --reload
```

### 6. Verify API Connection
Once the server is running, visit:
[http://localhost:8000/docs](http://localhost:8000/docs)
This will open the interactive Swagger UI where you can explore and test all available API endpoints!

