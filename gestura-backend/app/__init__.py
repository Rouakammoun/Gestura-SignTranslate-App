from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import logging
from datetime import timedelta
from logging.config import dictConfig

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_object='app.config.DevelopmentConfig'):
    """Application factory with improved JWT handling"""
    app = Flask(__name__, instance_relative_config=True)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
    )
    app.logger.info("Starting Flask application...")

    # Load configuration
    try:
        app.config.from_object(config_object)
        
        # Ensure required JWT config exists
        if 'JWT_SECRET_KEY' not in app.config:
            app.config['JWT_SECRET_KEY'] = os.urandom(32).hex()
        if 'JWT_ALGORITHM' not in app.config:
            app.config['JWT_ALGORITHM'] = 'HS256'
        if 'JWT_EXPIRATION' not in app.config:
            app.config['JWT_EXPIRATION'] = timedelta(hours=24)
            
        app.logger.info("JWT configuration verified")
        
    except Exception as e:
        app.logger.error(f"Configuration error: {str(e)}")
        raise

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS
    CORS(app, resources={
        r"/auth/*": {
            "origins": app.config.get('CORS_ORIGINS', '*'),
            "supports_credentials": True
        }
    })

    # Register blueprints
    from .routes import auth_bp
    app.register_blueprint(auth_bp)
    app.logger.info("Registered auth blueprint")

    # Simple health check
    @app.route('/')
    def health_check():
        return jsonify({"status": "healthy"}), 200

    app.logger.info("Application initialization complete")
    return app