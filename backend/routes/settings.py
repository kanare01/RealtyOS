from flask import Blueprint, request, jsonify
from backend.models.operations import Settings

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/api/settings', methods=['GET'])
def get_settings():
    try:
        data = Settings.get_global()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@settings_bp.route('/api/settings', methods=['POST'])
def save_settings():
    body = request.get_json() or {}
    general = body.get("general", {})
    alerts = body.get("alerts", {})

    try:
        data = Settings.save_global(general, alerts)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
