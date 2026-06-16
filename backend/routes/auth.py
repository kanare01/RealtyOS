from flask import Blueprint, request, jsonify
from backend.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    body = request.get_json() or {}
    email = body.get("email", "").lower().strip()
    password = body.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.get_by_email(email)
    if user:
        if user["password"] == password:
            return jsonify({
                "token": "mock-jwt-token-realtyos-secure",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "role": user["role"],
                    "email": user["email"],
                    "username": user["username"]
                }
            })
    return jsonify({"error": "Invalid credentials"}), 401
