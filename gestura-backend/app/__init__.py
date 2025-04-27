from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Initialize the database
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object('app.config.Config')

    # Initialize the database
    db.init_app(app)

    # Set up CORS
    CORS(app)

    # Initialize JWT
    app.config['JWT_SECRET_KEY'] = "hellomynameisroua"         # must match what you use when issuing tokens
    app.config['JWT_TOKEN_LOCATION'] = ['headers']           # look for tokens in headers
    app.config['JWT_HEADER_NAME'] = 'Authorization'          # header name
    app.config['JWT_HEADER_TYPE'] = 'Bearer'                # expects “Authorization: Bearer <token>”
    JWTManager(app)

    # Import and register routes
    from app.routes import main
    app.register_blueprint(main)

    return app
