import json
from backend.models import BaseModel
from backend.extensions import db

class Maintenance(BaseModel):
    table_name = "maintenance"

    @classmethod
    def create(cls, m_id, summary, property_name, unit_name, category, date, status="Open", expense=0.0):
        query = """
        INSERT INTO maintenance (id, summary, propertyName, unitName, status, category, expense, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (m_id, summary, property_name, unit_name, status, category, expense, date))
        return cls.get_by_id(m_id)


class Inspection(BaseModel):
    table_name = "inspections"

    @classmethod
    def create(cls, ins_id, property_name, unit_name, ins_type, date, inspector, status, notes, checklist):
        checklist_json = json.dumps(checklist)
        query = """
        INSERT INTO inspections (id, propertyName, unitName, type, date, inspector, status, notes, checklist)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (ins_id, property_name, unit_name, ins_type, date, inspector, status, notes, checklist_json))
        return cls.get_by_id(ins_id)


class Vendor(BaseModel):
    table_name = "vendors"

    @classmethod
    def create(cls, vendor_id, name, contact, rating, jobs_completed, specialty, license_no):
        query = """
        INSERT INTO vendors (id, name, contact, rating, jobsCompleted, specialty, licenseNo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (vendor_id, name, contact, rating, jobs_completed, specialty, license_no))
        return cls.get_by_id(vendor_id)


class CrmLead(BaseModel):
    table_name = "crm_leads"

    @classmethod
    def create(cls, lead_id, name, phone, email, prop_interest, preferred_type="Residential", status="New Lead", note=""):
        query = """
        INSERT INTO crm_leads (id, name, phone, email, propertyInterest, preferredType, status, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (lead_id, name, phone, email, prop_interest, preferred_type, status, note))
        return cls.get_by_id(lead_id)


class Asset(BaseModel):
    table_name = "assets"

    @classmethod
    def create(cls, asset_id, property_name, name, code, purchase_date, cost, depreciation_method, estimated_life, current_book_value, last_service_date):
        query = """
        INSERT INTO assets (id, propertyName, name, code, purchaseDate, cost, depreciationMethod, estimatedLife, currentBookValue, lastServiceDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (asset_id, property_name, name, code, purchase_date, cost, depreciation_method, estimated_life, current_book_value, last_service_date))
        return cls.get_by_id(asset_id)


class OcrDocument(BaseModel):
    table_name = "ocr_documents"

    @classmethod
    def create(cls, ocr_id, file_name, size, date_analyzed, parsed_amount, confidence, tenant_detected, lease_period):
        query = """
        INSERT INTO ocr_documents (id, fileName, size, dateAnalyzed, parsedAmount, confidence, tenantDetected, leasePeriod)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (ocr_id, file_name, size, date_analyzed, parsed_amount, confidence, tenant_detected, lease_period))
        return cls.get_by_id(ocr_id)


class AuditTrail(BaseModel):
    table_name = "audit_trail"

    @classmethod
    def log(cls, user, action, details):
        import datetime
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        query = """
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, ?, ?, ?)
        """
        db.execute_and_commit(query, (timestamp, user, action, details))

    @classmethod
    def get_ordered(cls):
        return db.fetch_all("SELECT * FROM audit_trail ORDER BY id DESC")


class Settings(BaseModel):
    table_name = "settings"

    @classmethod
    def get_global(cls):
        res = db.fetch_one("SELECT * FROM settings WHERE id = 1")
        if res:
            return {
                "general": json.loads(res["general"]) if isinstance(res["general"], str) else res["general"],
                "alerts": json.loads(res["alerts"]) if isinstance(res["alerts"], str) else res["alerts"]
            }
        return {"general": {}, "alerts": {}}

    @classmethod
    def save_global(cls, general, alerts):
        general_str = json.dumps(general)
        alerts_str = json.dumps(alerts)
        check = db.fetch_one("SELECT id FROM settings WHERE id = 1")
        if check:
            db.execute_and_commit("UPDATE settings SET general = ?, alerts = ? WHERE id = 1", (general_str, alerts_str))
        else:
            db.execute_and_commit("INSERT INTO settings (id, general, alerts) VALUES (1, ?, ?)", (general_str, alerts_str))
        return cls.get_global()
