import os
import oracledb
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
base_dir = Path(__file__).resolve().parent.parent.parent
env_path = base_dir / '.env'
load_dotenv(dotenv_path=env_path)

def get_db_connection():
    try:
        db_user = os.getenv('DB_USER')
        db_password = os.getenv('DB_PASSWORD')
        db_dsn = os.getenv('DB_DSN')
        wallet_location = os.getenv('WALLET_LOCATION')
        
        connection = oracledb.connect(
            user=db_user,
            password=db_password,
            dsn=db_dsn,
            config_dir=wallet_location,
            wallet_location=wallet_location,
            wallet_password=db_password
        )
        return connection
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return None

def init_db():
    print("🔄 Connecting to Oracle Cloud...")
    conn = get_db_connection()
    if conn:
        print("✅ Successfully connected to Oracle Cloud Database!")
        conn.close()
    else:
        print("❌ Connection failed!")