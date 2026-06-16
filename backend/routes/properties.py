import datetime
from flask import Blueprint, request, jsonify
from backend.models.property import Property
from backend.models.operations import AuditTrail
from backend.extensions import sanitize_text

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('/api/properties', methods=['GET'])
def get_properties():
    return jsonify(Property.get_all())

@properties_bp.route('/api/properties', methods=['POST'])
def add_property():
    body = request.get_json() or {}
    name = sanitize_text(body.get("name", ""))
    address = sanitize_text(body.get("address", ""))
    city = sanitize_text(body.get("city", ""))
    streetName = sanitize_text(body.get("streetName", ""))
    waterRate = float(body.get("waterRate", 0))
    electricityRate = float(body.get("electricityRate", 0))
    prop_type = body.get("type", "Residential")
    units_qty = int(body.get("units", 0))

    if not name:
        return jsonify({"error": "Property name is required"}), 400

    existing = Property.get_by_name(name)
    if existing:
        return jsonify({"error": f'A property with the name "{name}" already exists'}), 409

    # Generate incremental integer ID
    prop_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
    
    prop = Property.create(
        prop_id=prop_id,
        name=name,
        address=address,
        city=city,
        street_name=streetName,
        water_rate=waterRate,
        electricity_rate=electricityRate,
        prop_type=prop_type,
        units_qty=units_qty
    )

    # Log into audit trail
    AuditTrail.log(
        user='Admin User',
        action='Property Created',
        details=f"Added property: {name}"
    )

    return jsonify(prop), 201
