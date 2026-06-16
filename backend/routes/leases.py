import datetime
from flask import Blueprint, request, jsonify
from backend.models.lease import Lease
from backend.models.tenant import Tenant
from backend.models.unit import Unit
from backend.models.financial import ChartOfAccount, JournalEntry
from backend.models.operations import AuditTrail

leases_bp = Blueprint('leases', __name__)

@leases_bp.route('/api/leases', methods=['GET'])
def get_leases():
    return jsonify(Lease.get_all())

@leases_bp.route('/api/leases', methods=['POST'])
def add_lease():
    body = request.get_json() or {}
    try:
        tenantId = int(body.get("tenantId"))
        unitId = int(body.get("unitId"))
    except (ValueError, TypeError):
        return jsonify({"error": "tenantId and unitId must be valid numbers"}), 400

    startDate = body.get("startDate")
    endDate = body.get("endDate")
    rentEsc = float(body.get("rentEscalationPercentage", 0))
    secDep = float(body.get("securityDepositAmount", 0))
    coTenants = body.get("coTenants", [])
    guarantor = body.get("guarantorName", "")

    try:
        tenant = Tenant.get_by_id(tenantId)
        unit = Unit.get_by_id(unitId)

        if not tenant or not unit:
            return jsonify({"error": "Tenant or Unit not found"}), 404

        lease_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        
        # Create Lease
        lease = Lease.create(
            lease_id=lease_id,
            tenant_id=tenantId,
            tenant_name=tenant["name"],
            unit_id=unitId,
            unit_name=unit["name"],
            start_date=startDate,
            end_date=endDate,
            rent_escalation=rentEsc,
            security_deposit=secDep,
            signature_status="Signed",
            signed_date=datetime.date.today().isoformat(),
            co_tenants=coTenants,
            guarantor_name=guarantor,
            status="Active"
        )

        # Deposit Escrow accounting logic
        if secDep > 0:
            ChartOfAccount.update_balance("1010", secDep, is_asset_or_expense=True)
            ChartOfAccount.update_balance("2010", secDep, is_asset_or_expense=False)
            
            # Record Journal
            lines = [
                {"accountCode": "1010", "accountName": "Bank Account (Current)", "debit": secDep, "credit": 0},
                {"accountCode": "2010", "accountName": "Tenant Security Deposits", "debit": 0, "credit": secDep}
            ]
            JournalEntry.create(
                je_id=f"JE-DEP-{lease_id % 10000}",
                date=datetime.date.today().isoformat(),
                reference=f"LEASE-DEP-{lease_id}",
                description=f"Security deposit escrow transfer for Unit {unit['name']}",
                lines=lines
            )

        AuditTrail.log(
            user="Admin User",
            action="Lease Created",
            details=f"New lease active for Tenant {tenant['name']} in Unit {unit['name']}"
        )

        return jsonify(lease), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@leases_bp.route('/api/leases/<int:lease_id>', methods=['PUT'])
def update_lease(lease_id):
    body = request.get_json() or {}
    status = body.get("status", "")
    rentEsc = body.get("rentEscalationPercentage")

    try:
        lease = Lease.get_by_id(lease_id)
        if not lease:
            return jsonify({"error": "Lease agreement not found"}), 404

        final_status = status if status else lease["status"]
        final_rent_esc = float(rentEsc) if rentEsc is not None else float(lease["rentEscalationPercentage"])

        Lease.update_status_and_escalation(lease_id, final_status, final_rent_esc)

        AuditTrail.log(
            user="Admin User",
            action="Lease Modified",
            details=f"Renewed/Updated lease ID: {lease_id} to status {final_status}"
        )

        return jsonify(Lease.get_by_id(lease_id))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
