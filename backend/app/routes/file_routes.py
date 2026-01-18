
import os
from flask import Blueprint, request, jsonify, current_app, send_from_directory, abort
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from datetime import datetime
from app.extensions import db
from app.models import Document, Tenant, Property
from app.schemas import DocumentSchema
from app.utils import log_system_action

file_bp = Blueprint('files', __name__)

# Allowed file types
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'csv', 'xls', 'xlsx', 'doc', 'docx'}

# Allowed categories to organize storage
ALLOWED_CATEGORIES = {'tenant_documents', 'bank_statements', 'receipts', 'general'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@file_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    # Default to 'general' if not specified
    category = request.form.get('category', 'general')
    
    # Helper to clean empty strings or 'null' strings from form-data
    def get_id(key):
        val = request.form.get(key)
        if val and val != 'null' and val != 'undefined' and val.strip() != '':
            return int(val)
        return None

    tenant_id = get_id('tenant_id')
    property_id = get_id('property_id')
    
    if category not in ALLOWED_CATEGORIES:
        return jsonify({"error": f"Invalid category. Allowed: {', '.join(ALLOWED_CATEGORIES)}"}), 400
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Prepend timestamp to filename to avoid collisions
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        
        # Construct path: backend/app/static/uploads/<category>
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], category)
        os.makedirs(upload_folder, exist_ok=True)
        
        try:
            file.save(os.path.join(upload_folder, unique_filename))
            
            # Persist to DB
            file_url = f"/api/files/download/{category}/{unique_filename}"
            new_doc = Document(
                filename=filename,
                file_url=file_url,
                category=category,
                upload_date=datetime.now().strftime('%Y-%m-%d'),
                tenant_id=tenant_id,
                property_id=property_id
            )
            db.session.add(new_doc)
            db.session.commit()
            
            log_system_action('file upload', f"Uploaded file {filename} to {category}")
            
            return jsonify({
                "message": "File uploaded successfully", 
                "url": file_url,
                "filename": unique_filename,
                "category": category,
                "document": DocumentSchema().dump(new_doc)
            }), 201
            
        except Exception as e:
            current_app.logger.error(f"File upload error: {e}")
            return jsonify({"error": "Failed to save file or database record"}), 500
    
    return jsonify({"error": "File type not allowed"}), 400

@file_bp.route('/download/<category>/<filename>', methods=['GET'])
@jwt_required()
def download_file(category, filename):
    """
    Securely serve files. Requires valid JWT.
    """
    if category not in ALLOWED_CATEGORIES:
        abort(404)
        
    directory = os.path.join(current_app.config['UPLOAD_FOLDER'], category)
    
    if not os.path.exists(os.path.join(directory, filename)):
        return jsonify({"error": "File not found"}), 404

    return send_from_directory(directory, filename)

@file_bp.route('/documents', methods=['GET'])
@jwt_required()
def get_documents():
    docs = Document.query.order_by(Document.id.desc()).all()
    return jsonify(DocumentSchema(many=True).dump(docs))
