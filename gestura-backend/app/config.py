import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", 
        "postgresql://postgres:gestura@localhost:5432/gestura"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Security configuration
    SECRET_KEY = os.environ.get("SECRET_KEY", os.urandom(24).hex())
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", os.urandom(32).hex())
    JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 24))
    )
    # File upload configuration

    # Application settings
    DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() in ("true", "1", "t")

    # API configuration
    API_PREFIX = "/api/v1"
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

    # Email configuration
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True").lower() in ("true", "1", "t")
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB limit
BASE_URL = 'http://192.168.1.14:5000'  # Change to your actual domain

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG=False                                                                                                                                                   