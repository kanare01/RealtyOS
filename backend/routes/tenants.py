import datetime
from flask import Blueprint, request, jsonify
from backend.models.tenant import Tenant
from backend.models.unit import Unit
from backend.models.operations import AuditTrail
from backend.extensions import sanitize_text

tenants_bp = Blueprint('tenants', __name__)

@tenants_bp.route('/api/tenants', methods=['GET'])
def get_tenants():
    return jsonify(Tenant.get_all())

@tenants_bp.route('/api/tenants', methods=['POST'])
def add_tenants():
    body = request.get_json() or {}
    payloads = body if isinstance(body, list) else [body]
    processed_tenants = []

    try:
        for item in payloads:
            name = sanitize_text(item.get("name", ""))
            email = sanitize_text(item.get("email", ""))
            phone = sanitize_text(item.get("phone", ""))
            property_name = item.get("property")
            unit_name = item.get("unit")
            unitId = item.get("unitId")
            leaseEndDate = item.get("leaseEndDate")

            if not name:
                return jsonify({"error": "Tenant Name is required"}), 400

            target_unit = None
            if unitId:
                target_unit = Unit.get_by_id(unitId)
            else:
                target_unit = Unit.get_by_property_name_and_unit_name(property_name, unit_name)

            if not target_unit:
                return jsonify({"error": f"Unit in property is not registered"}), 400

            if target_unit["status"] == "Occupied":
                return jsonify({"error": f'Unit "{target_unit["name"]}" in "{target_unit["propertyName"]}" is currently occupied'}), 409

            tenant_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000 + len(processed_tenants)
            lease_end = leaseEndDate or (datetime.date.today() + datetime.timedelta(days=365)).isoformat()
            avatar = item.get("avatarUrl", f"https://i.pravatar.cc/150?u={name}")

            # Create Tenant via Model
            tenant = Tenant.create(
                tenant_id=tenant_id,
                name=name,
                email=email,
                phone=phone,
                property_name=target_unit["propertyName"],
                property_id=target_unit["propertyId"],
                unit_name=target_unit["name"],
                unit_id=target_unit["id"],
                lease_end_date=lease_end,
                status="Active",
                avatar_url=avatar,
                balance=0.0
            )

            # Update corresponding unit state to Occupied
            Unit.update_status(target_unit["id"], "Occupied")
            processed_tenants.append(tenant)

        return jsonify(processed_tenants), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tenants_bp.route('/api/tenants/<int:tenant_id>', methods=['PUT'])
def update_tenant(tenant_id):
    body = request.get_json() or {}
    status = body.get("status")
    lease_end = body.get("leaseEndDate")

    try:
        tenant = Tenant.get_by_id(tenant_id)
        if not tenant:
            return jsonify({"error": "Tenant not found"}), 404

        if status in ["Inactive", "Move-out", "Move-Out"]:
            Tenant.update_status_and_lease(tenant_id, "Inactive", lease_end or tenant["leaseEndDate"])
            Unit.update_status(tenant["unitId"], "Vacant")
        else:
            new_status = status or tenant["status"]
            Tenant.update_status_and_lease(tenant_id, new_status, lease_end)

        AuditTrail.log(
            user="Admin User",
            action="Tenant Update",
            details=f"Updated tenant {tenant['name']} status to {status or tenant['status']}."
        )

        return jsonify(Tenant.get_by_id(tenant_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
