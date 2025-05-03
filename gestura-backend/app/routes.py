# gestura-backend/app/routes.py

import jwt
import logging
import os
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from app.models import db, User
import time
from app.models import Feedback  # Add this import at the top
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# --- Helper Functions ---

def get_user_from_token():
    """Secure token verification with improved error handling"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        current_app.logger.warning("Missing/invalid Authorization header")
        raise ValueError('Missing or invalid Authorization header')

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=[current_app.config['JWT_ALGORITHM']],
            options={'verify_exp': True}
        )
        if not (user_id := str(payload.get('sub'))):
            raise jwt.InvalidTokenError("Missing user identifier in token")
            
        if not (user := User.query.get(int(user_id))):
            raise ValueError('User not found')
            
        return user
    except jwt.ExpiredSignatureError:
        raise ValueError('Token expired')
    except Exception as e:
        current_app.logger.error(f"Token verification failed: {str(e)}")
        raise ValueError('Invalid token')

def generate_auth_token(user):
    """Token generation with strict configuration checks"""
    try:
        payload = {
            'sub': str(user.id),
            'iat': datetime.now(timezone.utc),
            'exp': datetime.now(timezone.utc) + current_app.config.get('JWT_EXPIRATION', timedelta(hours=24))
        }
        return jwt.encode(
            payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm=current_app.config['JWT_ALGORITHM']
        )
    except Exception as e:
        current_app.logger.error(f"Token generation failed: {str(e)}")
        raise ValueError("Token generation error")

def save_profile_image(file, user_id):
    """Secure file handling with cleanup"""
    try:
        # Ensure upload folder exists
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Generate secure filename
        ext = secure_filename(file.filename).split('.')[-1]
        filename = f"user_{user_id}_{int(datetime.now().timestamp())}.{ext}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        # Save file
        file.save(filepath)
        return f"/uploads/{filename}"
        
    except Exception as e:
        current_app.logger.error(f"Image save failed: {str(e)}")
        raise ValueError("Could not save image")

# --- Routes ---

@auth_bp.route('/upload-profile-image', methods=['POST'])
def upload_profile_image():
    try:
        user = get_user_from_token()
        
        if 'profileImage' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['profileImage']
        if not file or file.filename == '':
            return jsonify({'error': 'Invalid file'}), 400

        # Validate file type
        allowed_extensions = {'jpg', 'jpeg', 'png', 'gif'}
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in allowed_extensions:
            return jsonify({'error': 'Invalid file type'}), 400

        # Generate safe filename
        filename = f"user_{user.id}_{int(time.time())}.{ext}"
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        # Ensure upload directory exists
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)
        file.save(upload_path)

        # Update user profile
        user.profile_image = f"/uploads/{filename}"
        db.session.commit()
        
        return jsonify({
            'imageUrl': user.profile_image,
            'message': 'Upload successful'
        }), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Upload failed: {str(e)}")
        return jsonify({'error': 'Upload failed'}), 500
    
@auth_bp.route('/update-profile', methods=['PUT'])
def update_profile():
    try:
        user = get_user_from_token()
        if not request.is_json:
            return jsonify({'error': 'JSON required'}), 415
            
        data = request.get_json()
        
        # Define valid language names
        VALID_LANGUAGES = ['English', 'French', 'Arabic']
        
        # Clean profile image URL if present
        if 'profileImage' in data and data['profileImage']:
            profile_image = str(data['profileImage']).replace('file://', '')
            if not profile_image.startswith(('http://', 'https://', '/')):
                profile_image = None
            data['profileImage'] = profile_image

        # Process updates
        updates = {}
        
        if 'name' in data:
            name = str(data['name']).strip()
            if not name:
                return jsonify({'error': 'Name cannot be empty'}), 400
            user.name = name
            updates['name'] = name
            
        if 'phoneNumber' in data:
            phone_number = str(data['phoneNumber']) if data['phoneNumber'] else None
            if phone_number and not phone_number.isdigit():
                return jsonify({'error': 'Phone number must contain only digits'}), 400
            user.phone_number = phone_number
            updates['phoneNumber'] = user.phone_number
            
        if 'language' in data:
            language = str(data['language']) if data['language'] else None
            if language and language not in VALID_LANGUAGES:
                return jsonify({
                    'error': 'Invalid language',
                    'valid_languages': VALID_LANGUAGES
                }), 400
            user.application_language = language
            updates['language'] = user.application_language
            
        if 'profileImage' in data:
            user.profile_image = data['profileImage']
            updates['profileImage'] = user.profile_image

        if updates:
            db.session.commit()
            current_app.logger.info(f"User {user.id} updated: {updates.keys()}")
            
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phoneNumber': user.phone_number,
                'language': user.application_language,  # Returns full name
                'profileImage': user.profile_image
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update failed: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Profile update failed',
            'details': str(e),
            'code': 'update_failed'
        }), 500
    
@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    try:
        user = get_user_from_token()
        return jsonify({
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phoneNumber': user.phone_number,
                'language': user.application_language,
                'profileImage': user.profile_image
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 401
# ... [keep your existing register/signin/ping routes unchanged] ...

# --- Authentication Routes ---

@auth_bp.route('/register', methods=['POST'])
def register():
    """Handles user registration."""
    if not request.is_json:
        # ... (keep register logic as provided) ...
        current_app.logger.warning("Registration failed: Request not JSON")
        return jsonify({'error': 'Request must be JSON', 'code': 'invalid_content_type'}), 415

    data = request.get_json()
    print(f"\n=== REGISTRATION REQUEST (/auth/register) ===")
    print(f"Raw data: {data}")

    required_fields = ['name', 'email', 'password', 'terms_accepted']
    missing_fields = [field for field in required_fields if data.get(field) is None]
    if missing_fields:
        msg = f'Missing required fields: {", ".join(missing_fields)}'
        current_app.logger.warning(f"Registration failed: {msg}")
        return jsonify({'error': msg, 'code': 'missing_fields'}), 400

    name = str(data['name']).strip()
    email = str(data['email']).lower().strip()
    password = str(data['password'])
    terms_accepted = bool(data.get('terms_accepted', False))

    print(f"Processing email: {email}")
    print(f"Terms accepted (processed): {terms_accepted} ({type(terms_accepted)})")

    if not name: return jsonify({'error': 'Name cannot be empty', 'code': 'invalid_name'}), 400
    if '@' not in email or '.' not in email.partition('@')[2]: return jsonify({'error': 'Invalid email format', 'code': 'invalid_email'}), 400
    if len(password) < 8: return jsonify({'error': 'Password must be at least 8 characters', 'code': 'weak_password'}), 400
    if not terms_accepted: return jsonify({"error": "You must accept the terms and conditions", 'code': 'terms_not_accepted'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        print(f"User already exists with email: {email}")
        return jsonify({'error': 'Email is already registered', 'code': 'email_exists'}), 409

    try:
        new_user = User(
            name=name,
            email=email,
            password=generate_password_hash(password, method='pbkdf2:sha256', salt_length=16),
            terms_accepted=terms_accepted,
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(new_user)
        db.session.commit()
        print(f"\n=== USER CREATED === ID: {new_user.id}")

        token = generate_auth_token(new_user)
        user_data = {'id': new_user.id, 'name': new_user.name, 'email': new_user.email}

        return jsonify({'message': 'User registered successfully', 'user': user_data, 'token': token}), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Registration database/internal error: {str(e)}", exc_info=True)
        print(f"\n=== REGISTRATION ERROR ===\n{str(e)}")
        error_details = str(e) if current_app.debug else "Could not process registration."
        return jsonify({'error': 'Registration failed due to server error', 'details': error_details, 'code': 'registration_failed'}), 500


@auth_bp.route('/signin', methods=['POST'])
def signin():
    """Handles user sign-in."""
    if not request.is_json:
        # ... (keep signin logic as provided, ensuring it returns user data) ...
        current_app.logger.warning("Sign-in failed: Request not JSON")
        return jsonify({'error': 'Request must be JSON', 'code': 'invalid_content_type'}), 415

    data = request.get_json()
    print(f"\n=== SIGNIN REQUEST (/auth/signin) ===")
    print(f"Raw data: {data}")

    email = data.get('email', '').lower().strip()
    password = data.get('password', '')

    if not email or not password:
        msg = 'Email and password are required'
        current_app.logger.warning(f"Sign-in failed: {msg}")
        return jsonify({'error': msg, 'code': 'missing_credentials'}), 400

    print(f"Attempting sign-in for email: {email}")

    try:
        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            print(f"Invalid credentials for email: {email} (User found: {'Yes' if user else 'No'})")
            current_app.logger.warning(f"Sign-in failed: Invalid credentials for {email}")
            return jsonify({'error': 'Invalid credentials', 'code': 'invalid_credentials'}), 401

        print(f"Password verified for user: ID={user.id}")
        token = generate_auth_token(user)
        user_data = { # Ensure all relevant fields needed by client are here
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phoneNumber': getattr(user, 'phone_number', None), # Safely get potentially missing attrs
            'language': getattr(user, 'application_language', 'English'),
            'profileImage': getattr(user, 'profile_image', None)
        }
        print("\n=== SIGNIN SUCCESS ===")
        return jsonify({'message': 'Sign-in successful', 'token': token, 'user': user_data}), 200

    except Exception as e:
        current_app.logger.error(f"Sign-in internal error: {str(e)}", exc_info=True)
        print(f"\n=== SIGNIN ERROR ===\n{str(e)}")
        error_details = str(e) if current_app.debug else "An internal error occurred."
        return jsonify({'error': 'Login failed due to server error', 'details': error_details, 'code': 'signin_failed'}), 500

    
@auth_bp.before_request
def log_request():
    if current_app.debug:
        print(f"\n[{request.method}] {request.path}")
        print("Headers:", dict(request.headers))
        if request.data:
            print("Body:", request.get_json())

    
# --- Ping Route ---
@auth_bp.route('/ping', methods=['GET'])
def ping():
    """Basic API connectivity check endpoint."""
    current_app.logger.debug("Ping endpoint called")
    return jsonify({'message': 'pong', 'status': 'ok', 'server_time_utc': datetime.now(timezone.utc).isoformat()}), 200


# --- Debug Route (Optional) ---
@auth_bp.route('/debug/users', methods=['GET'])
def debug_users():
    """Returns recent users for debugging purposes (requires FLASK_DEBUG=1)."""
    if not current_app.debug:
         return jsonify({'error': 'Not allowed in production'}), 403
    try:
        users = User.query.order_by(User.id.desc()).limit(20).all()
        return jsonify([{ # Ensure fields match your User model
            'id': u.id, 'name': u.name, 'email': u.email,
            'password_hash_start': u.password[:20] + '...' if u.password else None,
            'created_at': u.created_at.isoformat() if hasattr(u, 'created_at') and u.created_at else None,
            'terms_accepted': getattr(u, 'terms_accepted', None)
        } for u in users])
    except Exception as e:
        current_app.logger.error(f"Debug users error: {e}", exc_info=True)
        return jsonify({'error': 'Could not retrieve debug user list'}), 500

@auth_bp.route('/submit-feedback', methods=['POST'])
@cross_origin()
def submit_feedback():
    try:
        # Get authenticated user
        user = get_user_from_token()
        if not request.is_json:
            return jsonify({'error': 'JSON required'}), 415
            
        data = request.get_json()
        
        # Validate required fields
        if 'rating' not in data or 'comment' not in data:
            return jsonify({'error': 'Rating and comment are required'}), 400
            
        rating = int(data['rating'])
        comment = str(data['comment']).strip()
        
        # Validate rating range
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
            
        # Create and save new feedback
        new_feedback = Feedback(
            user_id=user.id,
            rating=rating,
            comment=comment,
            created_at=datetime.now(timezone.utc)  # Add timestamp
        )
        
        db.session.add(new_feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback': {
                'id': new_feedback.id,
                'rating': new_feedback.rating,
                'comment': new_feedback.comment,
                'created_at': new_feedback.created_at.isoformat()
            }
        }), 201
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Feedback error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500 