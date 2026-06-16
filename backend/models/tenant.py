from backend.models import BaseModel
from backend.extensions import db

class Tenant(BaseModel):
    table_name = "tenants"

    @classmethod
    def get_by_name(cls, name):
        return db.fetch_one("SELECT * FROM tenants WHERE LOWER(name) = ?", (name.lower().strip(),))

    @classmethod
    def create(cls, tenant_id, name, email, phone, property_name, property_id, unit_name, unit_id, lease_end_date, status="Active", avatar_url=None, balance=0.0):
        query = """
        INSERT INTO tenants (id, name, email, phone, property, propertyId, unit, unitId, leaseEndDate, status, avatarUrl, balance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (tenant_id, name, email, phone, property_name, property_id, unit_name, unit_id, lease_end_date, status, avatar_url, balance))
        return cls.get_by_id(tenant_id)

    @classmethod
    def update_balance(cls, tenant_id, amount_change):
        """Update balance by adding amount_change (can be positive or negative)"""
        query = "UPDATE tenants SET balance = balance + ? WHERE id = ?"
        db.execute_and_commit(query, (amount_change, tenant_id))

    @classmethod
    def update_status_and_lease(cls, tenant_id, status, lease_end_date=None):
        if lease_end_date:
            query = "UPDATE tenants SET status = ?, leaseEndDate = ? WHERE id = ?"
            db.execute_and_commit(query, (status, lease_end_date, tenant_id))
        else:
            query = "UPDATE tenants SET status = ? WHERE id = ?"
            db.execute_and_commit(query, (status, tenant_id))
