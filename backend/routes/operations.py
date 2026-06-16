import datetime
from flask import Blueprint, request, jsonify
from backend.models.operations import Maintenance, Inspection, Vendor, CrmLead, Asset, AuditTrail
from backend.services.ocr_service import OcrService
from backend.extensions import sanitize_text

operations_bp = Blueprint('operations', __name__)

# --- MAINTENANCE ---
@operations_bp.route('/api/maintenance', methods=['GET'])
def get_maintenance():
    return jsonify(Maintenance.get_all())

@operations_bp.route('/api/maintenance', methods=['POST'])
def add_maintenance():
    body = request.get_json() or {}
    property_name = sanitize_text(body.get("property", ""))
    unit_name = sanitize_text(body.get("unit", ""))
    summary = sanitize_text(body.get("summary", body.get("description", "General repair request")))
    category = sanitize_text(body.get("category", "General"))
    date = body.get("date") or datetime.date.today().isoformat()

    try:
        m_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        mt = Maintenance.create(
            m_id=m_id,
            summary=summary,
            property_name=property_name,
            unit_name=unit_name,
            category=category,
            date=date,
            status="Open",
            expense=0.0
        )
        return jsonify(mt), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- INSPECTIONS ---
@operations_bp.route('/api/inspections', methods=['GET'])
def get_inspections():
    return jsonify(Inspection.get_all())


# --- VENDORS ---
@operations_bp.route('/api/vendors', methods=['GET'])
def get_vendors():
    return jsonify(Vendor.get_all())


# --- CRM LEADS ---
@operations_bp.route('/api/crm-leads', methods=['GET'])
def get_crm_leads():
    return jsonify(CrmLead.get_all())

@operations_bp.route('/api/crm-leads', methods=['POST'])
def add_crm_lead():
    body = request.get_json() or {}
    name = sanitize_text(body.get("name", ""))
    phone = sanitize_text(body.get("phone", ""))
    email = sanitize_text(body.get("email", ""))
    prop_interest = sanitize_text(body.get("propertyInterest", "Sunshine Apartments"))
    note = sanitize_text(body.get("note", "Created via lead capturing pipeline."))

    if not name or not phone:
        return jsonify({"error": "Lead Name and Phone are required"}), 400

    try:
        lead_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        lead = CrmLead.create(
            lead_id=lead_id,
            name=name,
            phone=phone,
            email=email,
            prop_interest=prop_interest,
            preferred_type="Residential",
            status="New Lead",
            note=note
        )
        return jsonify(lead), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- ASSETS ---
@operations_bp.route('/api/assets', methods=['GET'])
def get_assets():
    return jsonify(Asset.get_all())


# --- AUDIT TRAIL ---
@operations_bp.route('/api/audit-trail', methods=['GET'])
def get_audit_trail():
    return jsonify(AuditTrail.get_ordered())


# --- OCR SERVICE INTELLIGENCE ---
@operations_bp.route('/api/ocr/analyze', methods=['POST'])
def run_ocr_analyze():
    body = request.get_json() or {}
    text = body.get("textToAnalyze", "")
    file_name = sanitize_text(body.get("fileName", "scanned_lease_contract.txt"))

    if not text:
        return jsonify({"error": "Document body text must be supplied to analyze metadata."}), 400

    try:
        doc = OcrService.analyze_document_text(text, file_name)
        return jsonify(doc)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
