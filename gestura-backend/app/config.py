import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or \
        "postgresql://postgres:Rourou.2002@localhost/gestura_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
