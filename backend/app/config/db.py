import os
from pathlib import Path

import oracledb
from dotenv import load_dotenv


base_dir = Path(__file__).resolve().parent.parent.parent
env_path = base_dir / ".env"
load_dotenv(dotenv_path=env_path)

pool = None


def get_pool():
    global pool
    if pool is None:
        try:
            db_user = os.getenv("DB_USER")
            db_password = os.getenv("DB_PASSWORD")
            db_dsn = os.getenv("DB_DSN")
            wallet_location = os.getenv("WALLET_LOCATION")
            if wallet_location:
                wallet_path = Path(wallet_location)
                if not wallet_path.is_absolute():
                    wallet_path = base_dir / wallet_path
                wallet_location = str(wallet_path)

            pool = oracledb.create_pool(
                user=db_user,
                password=db_password,
                dsn=db_dsn,
                config_dir=wallet_location,
                wallet_location=wallet_location,
                wallet_password=db_password,
                min=2,
                max=10,
                increment=1,
            )
            print("[DB] Database connection pool created")
        except Exception as e:
            print(f"[DB] Pool creation error: {e}")
    return pool


def get_db_connection():
    try:
        db_pool = get_pool()
        if db_pool:
            return db_pool.acquire()
        return None
    except Exception as e:
        print(f"[DB] Connection error: {e}")
        return None


def init_db():
    print("[DB] Initializing database...")
    db_pool = get_pool()
    if db_pool:
        print("[DB] Successfully connected to Oracle Cloud Database with pooling")
    else:
        print("[DB] Connection failed")
