from backend.models import BaseModel
from backend.extensions import db

class Unit(BaseModel):
    table_name = "units"

    @classmethod
    def get_by_property_and_name(cls, property_id, name):
        return db.fetch_one("SELECT * FROM units WHERE propertyId = ? AND LOWER(name) = ?", (property_id, name.lower().strip()))

    @classmethod
    def get_by_property_name_and_unit_name(cls, property_name, unit_name):
        return db.fetch_one("SELECT * FROM units WHERE propertyName = ? AND name = ?", (property_name, unit_name))

    @classmethod
    def create(cls, unit_id, property_id, property_name, name, rent_amount, status="Vacant", unit_type="Residential"):
        query = """
        INSERT INTO units (id, propertyId, propertyName, name, rentAmount, status, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (unit_id, property_id, property_name, name, rent_amount, status, unit_type))
        return cls.get_by_id(unit_id)

    @classmethod
    def update_status(cls, unit_id, status):
        query = "UPDATE units SET status = ? WHERE id = ?"
        db.execute_and_commit(query, (status, unit_id))
