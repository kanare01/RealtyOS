
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # --- Security ---
    # In production, this raises an error if SECRET_KEY is missing or default
    ENV = os.environ.get('FLASK_ENV', 'development')
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    if ENV == 'production' and (not SECRET_KEY or SECRET_KEY == 'dev-secret-key-change-in-prod'):
        raise ValueError("No SECRET_KEY set for production configuration")
    
    SECRET_KEY = SECRET_KEY or 'dev-secret-key-change-in-prod'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)
    
    # --- Database ---
    # Default to SQLite for dev, allow override for Postgres in prod
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///realtyos.db')
    
    # Fix for Heroku/Render/Fly.io postgres URLs (postgres:// -> postgresql://)
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Production DB Tuning (Connection Pooling for PostgreSQL)
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,  # Handles disconnected connections gracefully
        "pool_recycle": 300,    # Recycle connections every 5 minutes
        "pool_size": 20,        # Increased pool size for prod
        "max_overflow": 40,     # Allow spikes
    }
    
    # --- File Uploads ---
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', os.path.join(BASE_DIR, 'app', 'static', 'uploads'))
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

    # --- Background Tasks ---
    SCHEDULER_API_ENABLED = True
    
    # --- Logging ---
    LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT', 'false').lower() == 'true'
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

    # --- HTTP Security & Cookies ---
    # SSL_ENABLED should be true in production (behind Nginx/LoadBalancer)
    SSL_ENABLED = os.environ.get('SSL_ENABLED', 'false').lower() == 'true'
    
    # JWT & Session Cookies
    JWT_COOKIE_SECURE = SSL_ENABLED
    SESSION_COOKIE_SECURE = SSL_ENABLED
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # --- Rate Limiting ---
    # Use Redis in production for distributed limiting
    RATELIMIT_STORAGE_URL = os.environ.get('RATELIMIT_STORAGE_URL', "memory://")
