
from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# --- In-Memory Database (Mock) ---
# In a production environment, use SQLAlchemy with PostgreSQL.
# This ensures the app works immediately upon running without complex DB setup.

db = {
    "properties": [
        {
            "id": 1, 
            "name": "Sunset Apartments", 
            "address": "123 Ngong Road", 
            "city": "Nairobi",
            "type": "Residential", 
            "units": 12, 
            "occupancy": 85,
            "imageUrl": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            "waterRate": 150,
            "electricityRate": 25
        }
    ],
    "units": [
        {
            "id": 101, 
            "propertyId": 1, 
            "propertyName": "Sunset Apartments", 
            "name": "A1", 
            "rentAmount": 25000, 
            "status": "Occupied", 
            "type": "Residential",
            "category": "2 Bedroom"
        },
        {
            "id": 102, 
            "propertyId": 1, 
            "propertyName": "Sunset Apartments", 
            "name": "A2", 
            "rentAmount": 25000, 
            "status": "Vacant", 
            "type": "Residential",
            "category": "2 Bedroom"
        }
    ],
    "tenants": [
        {
            "id": 501, 
            "name": "John Kamau", 
            "email": "john.k@example.com", 
            "phone": "+254712345678", 
            "property": "Sunset Apartments", 
            "propertyId": 1,
            "unit": "A1", 
            "unitId": 101,
            "leaseEndDate": "2026-12-31", 
            "status": "Active",
            "balance": 0,
            "avatarUrl": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
    ],
    "invoices": [],
    "payments": [],
    "expenses": [],
    "maintenance": [],
    "utilities": []
}

# --- Helper Functions ---
def generate_id():
    return int(datetime.datetime.now().timestamp() * 1000)

# --- Routes ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "backend": "Flask"})

# Properties
@app.route('/api/properties', methods=['GET'])
def get_properties():
    return jsonify(db["properties"])

@app.route('/api/properties', methods=['POST'])
def add_property():
    data = request.json
    data['id'] = generate_id()
    db["properties"].append(data)
    return jsonify(data), 201

@app.route('/api/properties/<int:id>', methods=['PUT'])
def update_property(id):
    data = request.json
    for i, p in enumerate(db["properties"]):
        if p['id'] == id:
            db["properties"][i] = {**p, **data}
            return jsonify(db["properties"][i])
    return jsonify({"error": "Not found"}), 404

@app.route('/api/properties/<int:id>', methods=['DELETE'])
def delete_property(id):
    db["properties"] = [p for p in db["properties"] if p['id'] != id]
    return jsonify({"success": True})

# Units
@app.route('/api/units', methods=['GET'])
def get_units():
    return jsonify(db["units"])

@app.route('/api/units', methods=['POST'])
def add_unit():
    data = request.json
    if isinstance(data, list):
        for unit in data:
            unit['id'] = generate_id() + len(db["units"]) # Simple offset to avoid collisions in loop
            db["units"].append(unit)
        return jsonify(data), 201
    else:
        data['id'] = generate_id()
        db["units"].append(data)
        return jsonify(data), 201

@app.route('/api/units/<int:id>', methods=['DELETE'])
def delete_unit(id):
    db["units"] = [u for u in db["units"] if u['id'] != id]
    return jsonify({"success": True})

@app.route('/api/units/<int:id>', methods=['PUT'])
def update_unit(id):
    data = request.json
    for i, u in enumerate(db["units"]):
        if u['id'] == id:
            db["units"][i] = {**u, **data}
            return jsonify(db["units"][i])
    return jsonify({"error": "Not found"}), 404

# Tenants
@app.route('/api/tenants', methods=['GET'])
def get_tenants():
    return jsonify(db["tenants"])

@app.route('/api/tenants', methods=['POST'])
def add_tenant():
    data = request.json
    if isinstance(data, list):
        # Bulk add
        for t in data:
            t['id'] = generate_id() + len(db['tenants'])
            db['tenants'].append(t)
        return jsonify(data), 201
    else:
        data['id'] = generate_id()
        db["tenants"].append(data)
        return jsonify(data), 201

@app.route('/api/tenants/<int:id>', methods=['DELETE'])
def delete_tenant(id):
    db["tenants"] = [t for t in db["tenants"] if t['id'] != id]
    return jsonify({"success": True})

# Invoices
@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    return jsonify(db["invoices"])

@app.route('/api/invoices', methods=['POST'])
def add_invoice():
    data = request.json
    data['id'] = generate_id()
    db["invoices"].append(data)
    return jsonify(data), 201

# Payments
@app.route('/api/payments', methods=['GET'])
def get_payments():
    return jsonify(db["payments"])

@app.route('/api/payments', methods=['POST'])
def add_payment():
    data = request.json
    data['id'] = generate_id()
    db["payments"].append(data)
    return jsonify(data), 201

# Expenses
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    return jsonify(db["expenses"])

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.json
    data['id'] = generate_id()
    db["expenses"].append(data)
    return jsonify(data), 201

# Maintenance
@app.route('/api/maintenance', methods=['GET'])
def get_maintenance():
    return jsonify(db["maintenance"])

@app.route('/api/maintenance', methods=['POST'])
def add_maintenance():
    data = request.json
    data['id'] = generate_id()
    db["maintenance"].append(data)
    return jsonify(data), 201

@app.route('/api/maintenance/<int:id>', methods=['PUT'])
def update_maintenance(id):
    data = request.json
    for i, m in enumerate(db["maintenance"]):
        if m['id'] == id:
            db["maintenance"][i] = {**m, **data}
            return jsonify(db["maintenance"][i])
    return jsonify({"error": "Not found"}), 404

# Utilities
@app.route('/api/utilities', methods=['GET'])
def get_utilities():
    return jsonify(db["utilities"])

@app.route('/api/utilities', methods=['POST'])
def add_utility():
    data = request.json
    data['id'] = generate_id()
    db["utilities"].append(data)
    return jsonify(data), 201

@app.route('/api/utilities/<int:id>', methods=['PUT'])
def update_utility(id):
    data = request.json
    for i, u in enumerate(db["utilities"]):
        if u['id'] == id:
            db["utilities"][i] = {**u, **data}
            return jsonify(db["utilities"][i])
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    print("Starting Flask Server on port 5000...")
    app.run(debug=True, port=5000)
