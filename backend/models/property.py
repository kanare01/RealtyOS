from backend.models import BaseModel
from backend.extensions import db

class Property(BaseModel):
    table_name = "properties"

    @classmethod
    def get_by_name(cls, name):
        return db.fetch_one("SELECT * FROM properties WHERE LOWER(name) = ?", (name.lower().strip(),))

    @classmethod
    def create(cls, prop_id, name, address, city, street_name, water_rate, electricity_rate, prop_type, units_qty, occupancy=0.0):
        query = """
        INSERT INTO properties (id, name, address, city, streetName, waterRate, electricityRate, type, units, occupancy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (prop_id, name, address, city, street_name, water_rate, electricity_rate, prop_type, units_qty, occupancy))
        return cls.get_by_id(prop_id)

    @classmethod
    def update_occupancy(cls, property_id, occupancy):
        query = "UPDATE properties SET occupancy = ? WHERE id = ?"
        db.execute_and_commit(query, (occupancy, property_id))
