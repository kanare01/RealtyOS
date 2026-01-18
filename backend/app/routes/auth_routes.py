
from flask import Blueprint, request, jsonify
from app.extensions import db, limiter
from app.models import TeamMember
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from app.utils import log_system_action

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = TeamMember.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        
        log_system_action('login', 'User logged in successfully', username=user.username)
        
        return jsonify({
            "token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "role": user.role,
                "email": user.email,
                "username": user.username
            }
        }), 200
    
    log_system_action('login failed', f"Failed login attempt for {email}", username='System')
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("3 per hour") # Strict limit on registration
def register():
    # Only for initial setup or admin use
    data = request.json
    if TeamMember.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = TeamMember(
        name=data['name'],
        email=data['email'],
        username=data.get('username', data['email'].split('@')[0]),
        phone=data.get('phone'),
        role='Admin'
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    log_system_action('register', f"Registered new user {new_user.username}", username='System')
    
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = TeamMember.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "username": user.username,
        "phone": user.phone
    })

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_profile():
    user_id = get_jwt_identity()
    user = TeamMember.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.json
    
    if 'name' in data: user.name = data['name']
    # Note: Changing email might require re-verification in a stricter system
    if 'email' in data: user.email = data['email']
    if 'phone' in data: user.phone = data['phone']
    # Username update usually restricted, but allowing here
    if 'username' in data: user.username = data['username']
    
    db.session.commit()
    log_system_action('update profile', f"User {user.username} updated profile")
    
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "username": user.username,
        "phone": user.phone
    })

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = TeamMember.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    data = request.json
    current = data.get('current')
    new_pass = data.get('new')
    
    if not user.check_password(current):
        return jsonify({"error": "Incorrect current password"}), 400
        
    user.set_password(new_pass)
    db.session.commit()
    
    log_system_action('change password', f"User {user.username} changed password")
    return jsonify({"message": "Password changed successfully"}), 200
