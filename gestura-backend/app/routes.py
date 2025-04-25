# gestura-backend/app/routes.py (or wherever your routes file is)

import jwt
import logging # Use logging instead of just print for better tracking
from datetime import datetime, timedelta, timezone # Use timezone-aware datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash

# Adjust imports based on your project structure (where models.py is)
# from .models import db, User # If models.py is in the same directory
from app.models import db, User # If models.py is in an 'app' directory


# Initialize Blueprint WITH URL PREFIX
# All routes defined here will be accessed under /auth
# e.g., /auth/register, /auth/signin
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


# --- Helper Function for Token Generation ---
# NOTE: This relies on JWT configuration being set in your main app factory
# (e.g., app.config['JWT_SECRET_KEY'], app.config['JWT_ALGORITHM'], etc.)
def generate_auth_token(user):
    """Generate JWT token for authenticated user"""
    try:
        # Get expiration from config, default to 24 hours
        expiration_delta = current_app.config.get('JWT_EXPIRATION', timedelta(hours=24))
        # Get secret key (REQUIRED in config)
        secret_key = current_app.config['JWT_SECRET_KEY']
        # Get algorithm from config, default to HS256
        algorithm = current_app.config.get('JWT_ALGORITHM', 'HS256')

        payload = {
            'sub': user.id,                      # Subject (user ID) - Standard claim
            'iat': datetime.now(timezone.utc),   # Issued at (timezone-aware)
            'exp': datetime.now(timezone.utc) + expiration_delta # Expiration (timezone-aware)
            # You could add other claims like 'name' or 'role' if needed,
            # but keep the payload reasonably small.
        }
        token = jwt.encode(payload, secret_key, algorithm=algorithm)
        # In Python 3, jwt.encode returns bytes, decode to string for JSON
        return token
    except KeyError as e:
        current_app.logger.error(f"JWT Configuration Missing: {e}. Ensure JWT_SECRET_KEY is set.")
        raise ValueError("Server configuration error for token generation.") from e
    except Exception as e:
        current_app.logger.error(f"Token generation failed: {str(e)}", exc_info=True)
        raise


# --- Authentication Routes ---

@auth_bp.route('/register', methods=['POST'])
def register():
    """Handles user registration."""
    if not request.is_json:
        current_app.logger.warning("Registration failed: Request not JSON")
        return jsonify({'error': 'Request must be JSON', 'code': 'invalid_content_type'}), 415 # Unsupported Media Type

    data = request.get_json()

    # --- Start Debug Prints ---
    print(f"\n=== REGISTRATION REQUEST (/auth/register) ===")
    # print(f"Headers: {request.headers}") # Be careful logging headers
    print(f"Raw data: {data}")
    # --- End Debug Prints ---

    # Validate required fields
    required_fields = ['name', 'email', 'password', 'terms_accepted']
    # Check for missing keys OR explicitly null values
    missing_fields = [field for field in required_fields if data.get(field) is None]
    if missing_fields:
        msg = f'Missing required fields: {", ".join(missing_fields)}'
        current_app.logger.warning(f"Registration failed: {msg}")
        return jsonify({'error': msg, 'code': 'missing_fields'}), 400

    # Normalize and validate data
    name = str(data['name']).strip()
    email = str(data['email']).lower().strip()
    password = str(data['password']) # Don't strip password
    # Use 'terms_accepted', ensure it's boolean
    terms_accepted = bool(data.get('terms_accepted', False))

    print(f"Processing email: {email}")
    print(f"Terms accepted (processed): {terms_accepted} ({type(terms_accepted)})")

    # Field Validations
    if not name:
        return jsonify({'error': 'Name cannot be empty', 'code': 'invalid_name'}), 400
    if '@' not in email or '.' not in email.partition('@')[2]:
        return jsonify({'error': 'Invalid email format', 'code': 'invalid_email'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters', 'code': 'weak_password'}), 400
    if not terms_accepted: # Check the processed boolean value
        return jsonify({"error": "You must accept the terms and conditions", 'code': 'terms_not_accepted'}), 400

    # Check for existing user
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        print(f"User already exists with email: {email}")
        return jsonify({'error': 'Email is already registered', 'code': 'email_exists'}), 409 # Conflict

    # Create and save user
    try:
        new_user = User(
            name=name,
            email=email,
            # Use pbkdf2:sha256 or pbkdf2:sha512 (sha512 generally preferred if performance allows)
            password=generate_password_hash(password, method='pbkdf2:sha256', salt_length=16),
            terms_accepted=terms_accepted,
            created_at=datetime.now(timezone.utc) # Store timezone-aware time
            # Add other fields if they exist in your model and are sent
            # phone_number=data.get('phoneNumber', '').strip() or None,
            # application_language=data.get('language', 'English')
        )
        db.session.add(new_user)
        db.session.commit()

        print(f"\n=== USER CREATED ===")
        print(f"ID: {new_user.id}, Name: {new_user.name}, Email: {new_user.email}")

        # Generate token
        token = generate_auth_token(new_user)

        # Prepare user data for response (only non-sensitive info)
        user_data = {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
            # Add other fields from new_user if needed by client
        }

        return jsonify({
            'message': 'User registered successfully',
            'user': user_data,
            'token': token
        }), 201 # Created

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Registration database/internal error: {str(e)}", exc_info=True)
        print(f"\n=== REGISTRATION ERROR ===\n{str(e)}")
        # Return generic error in production
        error_details = str(e) if current_app.debug else "Could not process registration."
        return jsonify({
            'error': 'Registration failed due to server error',
            'details': error_details,
            'code': 'registration_failed'
        }), 500


@auth_bp.route('/signin', methods=['POST'])
def signin():
    """Handles user sign-in."""
    if not request.is_json:
        current_app.logger.warning("Sign-in failed: Request not JSON")
        return jsonify({'error': 'Request must be JSON', 'code': 'invalid_content_type'}), 415

    data = request.get_json()

    # --- Start Debug Prints ---
    print(f"\n=== SIGNIN REQUEST (/auth/signin) ===")
    # print(f"Headers: {request.headers}")
    print(f"Raw data: {data}")
    # --- End Debug Prints ---

    email = data.get('email', '').lower().strip()
    password = data.get('password', '') # Don't strip password

    if not email or not password:
        msg = 'Email and password are required'
        current_app.logger.warning(f"Sign-in failed: {msg}")
        return jsonify({'error': msg, 'code': 'missing_credentials'}), 400

    print(f"Attempting sign-in for email: {email}")

    try:
        user = User.query.filter_by(email=email).first()

        # Use generic message for security (don't reveal if email exists or password wrong)
        if not user or not check_password_hash(user.password, password):
            print(f"Invalid credentials for email: {email} (User found: {'Yes' if user else 'No'})")
            current_app.logger.warning(f"Sign-in failed: Invalid credentials for {email}")
            # Optional: Log existing users ONLY in debug mode if needed
            if current_app.debug and not user:
                 all_users = User.query.limit(5).all()
                 print(f"Debug: No user found. First 5 users in DB: {[u.email for u in all_users]}")
            return jsonify({'error': 'Invalid credentials', 'code': 'invalid_credentials'}), 401 # Unauthorized

        print(f"Password verified for user: ID={user.id}, Email={user.email}")

        # Generate token
        token = generate_auth_token(user)

        # Prepare user data for response - THIS IS THE FIX
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email
            # Add other fields from user object if needed by the app
            # 'phoneNumber': user.phone_number,
            # 'language': user.application_language,
            # 'profileImage': user.profile_image
        }

        print("\n=== SIGNIN SUCCESS ===")
        # print(f"Generated token: {token[:20]}...") # Don't log full token usually

        # Return message, token, AND user data
        return jsonify({
            'message': 'Sign-in successful',
            'token': token,
            'user': user_data # *** THIS WAS THE MISSING PIECE ***
        }), 200 # OK

    except Exception as e:
        current_app.logger.error(f"Sign-in internal error: {str(e)}", exc_info=True)
        print(f"\n=== SIGNIN ERROR ===\n{str(e)}")
        error_details = str(e) if current_app.debug else "An internal error occurred during sign in."
        return jsonify({'error': 'Login failed due to server error', 'details': error_details, 'code': 'signin_failed'}), 500


# Optional Debug Route (Keep if helpful during development)
@auth_bp.route('/debug/users', methods=['GET'])
def debug_users():
    """Returns recent users for debugging purposes."""
    if not current_app.debug:
         # Only allow this route in debug mode
         return jsonify({'error': 'Not allowed in production'}), 403

    try:
        users = User.query.order_by(User.id.desc()).limit(20).all()
        return jsonify([{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'password_hash_start': u.password[:20] + '...' if u.password else None,
            'created_at': u.created_at.isoformat() if u.created_at else None,
            'terms_accepted': u.terms_accepted
        } for u in users])
    except Exception as e:
        current_app.logger.error(f"Debug users error: {e}", exc_info=True)
        return jsonify({'error': 'Could not retrieve debug user list'}), 500

# --- End of routes.py ---