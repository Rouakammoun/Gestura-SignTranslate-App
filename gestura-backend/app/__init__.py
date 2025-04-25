from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Select config class based on FLASK_ENV
    env = os.getenv("FLASK_ENV", "development").lower()
    if env == "production":
        app.config.from_object('app.config.ProductionConfig')
    else:
        app.config.from_object('app.config.DevelopmentConfig')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # CORS Configuration
    CORS(app, resources={
        r"/auth/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Authorization"]
        }
    })

    # Register blueprints
    from .routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    # Create tables in development mode
    if app.config['DEBUG']:
        with app.app_context():
            db.create_all()

    return app
