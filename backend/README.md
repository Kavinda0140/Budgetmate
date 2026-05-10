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

### 2. Configure the Oracle Cloud Wallet
Because the wallet contains sensitive connection certificates, it is ignored by Git. 
1. Ask the project lead for the `Wallet_ZYHS69EYEV1FQDXG.zip` file (or your specific wallet zip).
2. Create a folder named `wallet` inside this `backend/` directory.
3. Extract all the files from the zip into `backend/wallet/`.

### 3. Set up Environment Variables
Because passwords are also ignored by Git, you need to create your own local `.env` file:
1. Copy the `backend/.env.example` file and rename the copy to `.env`.
2. Open the new `.env` file and fill in your actual database credentials, JWT secret, and email configurations (ask the team lead if unsure).

### 4. Run the Server
Start the development server using the main module:
```bash
python -m app.main
```

Alternatively, you can run it directly with Uvicorn:
```bash
uvicorn app.main:app --reload
```

### 5. Verify API Connection
Once the server is running, visit:
[http://localhost:8000/docs](http://localhost:8000/docs)
This will open the interactive Swagger UI where you can explore and test all available API endpoints!
