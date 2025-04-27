import os
import uuid
import cv2
import jwt
import base64
import numpy as np
import threading
import tempfile
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
import mediapipe as mp

from .models import db, User
from .my_functions import image_process, keypoint_extraction

# Blueprint definition for main routes
main = Blueprint('main', __name__)

# --- Load model and settings once
MODEL_PATH = 'app/sign_model_v222.keras'
DATA_PATH = 'app/data1'
actions = np.array(os.listdir(DATA_PATH))
model = load_model(MODEL_PATH)
frame_count = model.input_shape[1]  # expected number of frames

# Thread-safe lock for FIFO processing
decode_lock = threading.Lock()

# In-memory list to track uploaded videos
uploaded_videos = []

# Utility: extract N evenly spaced frames from video file
def extract_n_frames(video_path, n):
    cap = cv2.VideoCapture(video_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total <= 0:
        cap.release()
        return []

    indices = np.linspace(0, total - 1, n).astype(int)
    frames = []
    idx_set = set(indices.tolist())
    for i in range(total):
        ret, frame = cap.read()
        if not ret:
            break
        if i in idx_set:
            frames.append(frame)
        if len(frames) == n:
            break
    cap.release()
    return frames

@main.route('/translate_video', methods=['POST'])
def translate_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    video_file = request.files['video']
    language = request.form.get('language', 'en')

    upload_dir = os.path.join('app','uploads')
    os.makedirs(upload_dir, exist_ok=True)
    save_path = os.path.join(upload_dir, video_file.filename)
    video_file.save(save_path)

    uploaded_videos.append(save_path)

    with decode_lock:
        frames = extract_n_frames(save_path, frame_count)
        if len(frames) < frame_count:
            return jsonify({'error': f'Could only extract {len(frames)} frames, need {frame_count}'}), 500

        keypoints_list = []
        with mp.solutions.holistic.Holistic(
            min_detection_confidence=0.75,
            min_tracking_confidence=0.75
        ) as holistic:
            for img in frames:
                results = image_process(img, holistic)
                kp = keypoint_extraction(results)
                keypoints_list.append(kp)

        input_data = np.expand_dims(keypoints_list, axis=0)
        preds = model.predict(input_data, verbose=0)[0]
        idx = int(np.argmax(preds))
        prediction = actions[idx]
        confidence = float(preds[idx])

    return jsonify({
        'prediction': prediction,
        'confidence': confidence,
        'language': language
    }), 200

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    accepted_terms = data.get('acceptedTerms')

    if not name or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if accepted_terms != True:
        return jsonify({"error": "You must accept the terms and conditions"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email is already registered'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(name=name, email=email, password=hashed_password, terms_accepted=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

from flask_jwt_extended import create_access_token

@main.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        'message': 'Signed in',
        'token': access_token
    }), 200


@main.route('/profile/photo', methods=['POST'])
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if 'photo' not in request.files:
        return jsonify({'error': 'No file'}), 400

    photo = request.files['photo']
    
    # Validate file type
    if not photo.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return jsonify({'error': 'Invalid file type'}), 400

    ext = os.path.splitext(photo.filename)[1]
    filename = f"user_{user.id}_{uuid.uuid4()}{ext}"
    upload_dir = os.path.join('app', 'uploads', 'profile_images')
    os.makedirs(upload_dir, exist_ok=True)
    path = os.path.join(upload_dir, filename)
    photo.save(path)

    user.profile_image = f"/static/profile_images/{filename}"
    db.session.commit()

    return jsonify({'image_url': user.profile_image}), 200

@main.route('/profile', methods=['GET'])
@jwt_required(verify_type=False)
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'name': user.name,
        'profile_image': user.profile_image or None
    }), 200
@main.route('/static/profile_images/<filename>')
def serve_profile_image(filename):
    return send_from_directory(os.path.join('app', 'uploads', 'profile_images'), filename)