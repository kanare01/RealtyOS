
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.extensions import db
from app.models import TeamMember, AuditLog
from datetime import datetime

def log_system_action(action, description, username=None, details=None):
    """
    Logs an action to the AuditLog table.
    If username is not provided, attempts to resolve from JWT or defaults to 'System'.
    """
    try:
        if not username:
            try:
                # Attempt to get user from current request context if available
                verify_jwt_in_request(optional=True)
                user_id = get_jwt_identity()
                if user_id:
                    user = TeamMember.query.get(user_id)
                    username = user.username if user else 'unknown'
                else:
                    username = 'System'
            except:
                username = 'System'

        ip = request.remote_addr if request else '127.0.0.1'
        
        log = AuditLog(
            action=action,
            description=description,
            username=username,
            date=datetime.now().isoformat(),
            ip_address=ip
        )
        # Store extra details if the model supports it, otherwise append to description
        if details:
            log.description = f"{description} | Details: {details}"[:255]

        db.session.add(log)
        db.session.commit()
    except Exception as e:
        # Fallback to stdout if DB logging fails
        print(f"FAILED TO LOG AUDIT: {action} - {description}. Error: {e}")

def role_required(allowed_roles):
    """
    Decorator to ensure the logged-in user has one of the allowed roles.
    Values for roles: 'Admin', 'Manager', 'Agent'.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = TeamMember.query.get(user_id)
            
            if not user:
                return jsonify(msg="User not found"), 404
                
            if user.role not in allowed_roles:
                return jsonify(msg="Insufficient permissions"), 403
                
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def admin_required(fn):
    return role_required(['Admin'])(fn)

def manager_required(fn):
    return role_required(['Admin', 'Manager'])(fn)
