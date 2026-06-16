import datetime
from flask import Blueprint, request, jsonify
from backend.models.property import Property
from backend.models.unit import Unit
from backend.extensions import sanitize_text

units_bp = Blueprint('units', __name__)

@units_bp.route('/api/units', methods=['GET'])
def get_units():
    return jsonify(Unit.get_all())

@units_bp.route('/api/units', methods=['POST'])
def add_units():
    body = request.get_json() or {}
    payloads = body if isinstance(body, list) else [body]
    processed_units = []

    try:
        for item in payloads:
            propertyId = item.get("propertyId")
            name = sanitize_text(item.get("name", ""))
            rentAmount = float(item.get("rentAmount", 0))

            if not propertyId or not name:
                return jsonify({"error": "Unit Name and Property are required"}), 400

            prop = Property.get_by_id(propertyId)
            if not prop:
                return jsonify({"error": f"Associated property ID {propertyId} does not exist"}), 400

            prop_name = prop["name"]
            prop_type = prop["type"]

            existing = Unit.get_by_property_and_name(propertyId, name)
            if existing:
                return jsonify({"error": f'Unit "{name}" already exists in "{prop_name}"'}), 409

            unit_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000 + len(processed_units)
            
            unit = Unit.create(
                unit_id=unit_id,
                property_id=propertyId,
                property_name=prop_name,
                name=name,
                rent_amount=rentAmount,
                status="Vacant",
                unit_type=prop_type
            )
            processed_units.append(unit)

        return jsonify(processed_units), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
