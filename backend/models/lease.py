import json
from backend.models import BaseModel
from backend.extensions import db

class Lease(BaseModel):
    table_name = "leases"

    @classmethod
    def create(cls, lease_id, tenant_id, tenant_name, unit_id, unit_name, start_date, end_date, rent_escalation, security_deposit, signature_status="Signed", signed_date=None, co_tenants=None, guarantor_name="", status="Active"):
        co_tenants_json = json.dumps(co_tenants or [])
        query = """
        INSERT INTO leases (id, tenantId, tenantName, unitId, unitName, startDate, endDate, status, rentEscalationPercentage, securityDepositAmount, signatureStatus, signedDate, coTenants, guarantorName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (
            lease_id, tenant_id, tenant_name, unit_id, unit_name, start_date, end_date, status, rent_escalation, security_deposit, signature_status, signed_date, co_tenants_json, guarantor_name
        ))
        return cls.get_by_id(lease_id)

    @classmethod
    def update_status_and_escalation(cls, lease_id, status, rent_escalation=None):
        if rent_escalation is not None:
            query = "UPDATE leases SET status = ?, rentEscalationPercentage = ? WHERE id = ?"
            db.execute_and_commit(query, (status, rent_escalation, lease_id))
        else:
            query = "UPDATE leases SET status = ? WHERE id = ?"
            db.execute_and_commit(query, (status, lease_id))
