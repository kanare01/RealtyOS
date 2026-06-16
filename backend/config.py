import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'realtyos-secret-secure-key-123')
    DB_FILE = os.environ.get('DB_FILE', 'realtyos.db')
    PORT = int(os.environ.get('PORT', 3000))
    DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 't')
    STATIC_FOLDER = os.environ.get('STATIC_FOLDER', '../dist')
