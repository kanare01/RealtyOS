from flask import Flask, request, jsonify
import sqlite3
import json
import os
import re
import datetime

app = Flask(__name__, static_folder="../dist", static_url_path="")
PORT = 3000
DB_FILE = "realtyos.db"

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        username TEXT,
        isActive INTEGER,
        failedAttempts INTEGER,
        lockedUntil REAL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        address TEXT,
        city TEXT,
        streetName TEXT,
        waterRate REAL,
        electricityRate REAL,
        type TEXT,
        units INTEGER DEFAULT 0,
        occupancy REAL DEFAULT 0
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS units (
        id INTEGER PRIMARY KEY,
        propertyId INTEGER,
        propertyName TEXT,
        name TEXT,
        rentAmount REAL,
        status TEXT,
        type TEXT,
        FOREIGN KEY(propertyId) REFERENCES properties(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        property TEXT,
        propertyId INTEGER,
        unit TEXT,
        unitId INTEGER,
        leaseEndDate TEXT,
        status TEXT,
        avatarUrl TEXT,
        balance REAL,
        FOREIGN KEY(propertyId) REFERENCES properties(id),
        FOREIGN KEY(unitId) REFERENCES units(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY,
        property TEXT,
        amount REAL,
        date TEXT,
        status TEXT,
        category TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recurring_expenses (
        id INTEGER PRIMARY KEY,
        property TEXT,
        amount REAL,
        frequency TEXT,
        status TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY,
        date TEXT,
        dueDate TEXT,
        invoiceNumber TEXT UNIQUE,
        tenantName TEXT,
        item TEXT,
        amount REAL,
        status TEXT,
        tenantId INTEGER,
        property TEXT,
        unit TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY,
        date TEXT,
        paymentId TEXT UNIQUE,
        tenantName TEXT,
        propertyName TEXT,
        unitName TEXT,
        amount REAL,
        method TEXT,
        status TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS maintenance (
        id INTEGER PRIMARY KEY,
        summary TEXT,
        propertyName TEXT,
        unitName TEXT,
        status TEXT,
        category TEXT,
        expense REAL,
        date TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leases (
        id INTEGER PRIMARY KEY,
        tenantId INTEGER,
        tenantName TEXT,
        unitId INTEGER,
        unitName TEXT,
        startDate TEXT,
        endDate TEXT,
        status TEXT,
        rentEscalationPercentage REAL,
        securityDepositAmount REAL,
        signatureStatus TEXT,
        signedDate TEXT,
        coTenants TEXT, -- JSON array
        guarantorName TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chart_of_accounts (
        code TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        balance REAL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        date TEXT,
        reference TEXT,
        description TEXT,
        lines TEXT -- JSON array
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inspections (
        id INTEGER PRIMARY KEY,
        propertyName TEXT,
        unitName TEXT,
        type TEXT,
        date TEXT,
        inspector TEXT,
        status TEXT,
        notes TEXT,
        checklist TEXT -- JSON object
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mpesa_transactions (
        id TEXT PRIMARY KEY,
        checkoutRequestId TEXT,
        phoneNumber TEXT,
        amount REAL,
        mpesaReceiptNumber TEXT UNIQUE,
        status TEXT,
        timestamp TEXT,
        tenantName TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vendors (
        id INTEGER PRIMARY KEY,
        name TEXT,
        contact TEXT,
        rating REAL,
        jobsCompleted INTEGER,
        specialty TEXT,
        licenseNo TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crm_leads (
        id INTEGER PRIMARY KEY,
        name TEXT,
        phone TEXT,
        email TEXT,
        propertyInterest TEXT,
        preferredType TEXT,
        status TEXT,
        note TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY,
        propertyName TEXT,
        name TEXT,
        code TEXT,
        purchaseDate TEXT,
        cost REAL,
        depreciationMethod TEXT,
        estimatedLife INTEGER,
        currentBookValue REAL,
        lastServiceDate TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ocr_documents (
        id TEXT PRIMARY KEY,
        fileName TEXT,
        size TEXT,
        dateAnalyzed TEXT,
        parsedAmount REAL,
        confidence REAL,
        tenantDetected TEXT,
        leasePeriod TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_trail (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        user TEXT,
        action TEXT,
        details TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        general TEXT, -- JSON object
        alerts TEXT  -- JSON object
    )
    """)

    # Seed initial data if users table is empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        # Seed Admin User
        cursor.execute("""
        INSERT INTO users (name, email, password, role, username, isActive, failedAttempts, lockedUntil)
        VALUES ('Admin User', 'admin@realtyos.com', 'admin123', 'Admin', 'admin', 1, 0, 0)
        """)

        # Seed Properties
        properties_seed = [
            (1, "Sunshine Apartments", "123 Solar Way, Nairobi", "Nairobi", "Solar Way", 150.0, 25.0, "Residential", 10, 80.0),
            (2, "Business Plaza", "456 Commerce St, Mombasa", "Mombasa", "Commerce St", 120.0, 30.0, "Commercial", 5, 100.0)
        ]
        cursor.executemany("INSERT INTO properties VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", properties_seed)

        # Seed Units
        units_seed = [
            (1, 1, "Sunshine Apartments", "A1", 25000.0, "Occupied", "Residential"),
            (2, 1, "Sunshine Apartments", "A2", 25000.0, "Occupied", "Residential"),
            (3, 1, "Sunshine Apartments", "A3", 25000.0, "Vacant", "Residential"),
            (4, 2, "Business Plaza", "Shop 1", 50000.0, "Occupied", "Commercial")
        ]
        cursor.executemany("INSERT INTO units VALUES (?, ?, ?, ?, ?, ?, ?)", units_seed)

        # Seed Tenants
        tenants_seed = [
            (1, "John Doe", "john@example.com", "0712345678", "Sunshine Apartments", 1, "A1", 1, "2025-12-31", "Active", "https://i.pravatar.cc/150?u=john", 0.0),
            (2, "Jane Smith", "jane@example.com", "0787654321", "Sunshine Apartments", 1, "A2", 2, "2025-06-30", "Active", "https://i.pravatar.cc/150?u=jane", 5000.0)
        ]
        cursor.executemany("INSERT INTO tenants VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", tenants_seed)

        # Seed Invoices
        invoices_seed = [
            (1, "2024-02-01", "2024-02-15", "INV-001", "John Doe", "Rent - Feb 2024", 25000.0, "paid", 1, "Sunshine Apartments", "A1"),
            (2, "2024-02-01", "2024-02-15", "INV-002", "Jane Smith", "Rent - Feb 2024", 25000.0, "pending", 2, "Sunshine Apartments", "A2")
        ]
        cursor.executemany("INSERT INTO invoices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", invoices_seed)

        # Seed Payments
        payments_seed = [
            (1, "2024-02-02", "PAY-001", "John Doe", "Sunshine Apartments", "A1", 25000.0, "MPESA", "confirmed")
        ]
        cursor.executemany("INSERT INTO payments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", payments_seed)

        # Seed Maintenance
        maintenance_seed = [
            (1, 'Leaking tap in kitchen', 'Sunshine Apartments', 'A1', 'Open', 'Plumbing', 0.0, '2023-10-25'),
            (2, 'Broken window in living room', 'Ocean View', 'B2', 'In Progress', 'Repair', 5000.0, '2023-10-24')
        ]
        cursor.executemany("INSERT INTO maintenance VALUES (?, ?, ?, ?, ?, ?, ?, ?)", maintenance_seed)

        # Seed Leases
        co_tenants_seed_1 = json.dumps([{"name": "Alex Doe", "relationship": "Spouse"}])
        leases_seed = [
            (1, 1, "John Doe", 1, "A1", "2024-01-01", "2025-12-31", "Active", 10.0, 25000.0, "Signed", "2024-01-01", co_tenants_seed_1, "Mark Doe"),
            (2, 2, "Jane Smith", 2, "A2", "2024-01-01", "2025-06-30", "RenewalDue", 5.0, 25000.0, "Signed", "2024-01-01", "[]", "")
        ]
        cursor.executemany("INSERT INTO leases VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", leases_seed)

        # Seed Chart of Accounts
        coa_seed = [
            ("1010", "Bank Account (Current)", "Asset", 500000.00),
            ("1020", "Accounts Receivable", "Asset", 5000.00),
            ("2010", "Tenant Security Deposits", "Liability", 50000.00),
            ("4010", "Rental Revenue", "Revenue", 125000.00),
            ("5010", "Repairs & Maintenance Expense", "Expense", 5000.00)
        ]
        cursor.executemany("INSERT INTO chart_of_accounts VALUES (?, ?, ?, ?)", coa_seed)

        # Seed Journal Entries
        je_lines_1 = json.dumps([
            {"accountCode": "1020", "accountName": "Accounts Receivable", "debit": 25000.00, "credit": 0},
            {"accountCode": "4010", "accountName": "Rental Revenue", "debit": 0, "credit": 25000.00}
        ])
        je_lines_2 = json.dumps([
            {"accountCode": "1010", "accountName": "Bank Account (Current)", "debit": 25000.00, "credit": 0},
            {"accountCode": "1020", "accountName": "Accounts Receivable", "debit": 0, "credit": 25000.00}
        ])
        journal_seed = [
            ("JE-001", "2024-02-01", "BILL-RENT-FEB-24", "Rent billing accrual for Sunshine Apartments (Tenant: Jane Smith)", je_lines_1),
            ("JE-002", "2024-02-02", "RCV-MPESA-PAY-001", "Rent collection check for Sunshine Apartments (Tenant: John Doe)", je_lines_2)
        ]
        cursor.executemany("INSERT INTO journal_entries VALUES (?, ?, ?, ?, ?)", journal_seed)

        # Seed Inspections
        ins_checklist_1 = json.dumps({"wallCondition": "Excellent", "plumbingLeaks": "None", "locksWorking": "Yes", "paintApplied": "Yes"})
        ins_checklist_2 = json.dumps({"wallCondition": "Dampness Identified", "plumbingLeaks": "None", "locksWorking": "Yes", "paintApplied": "No"})
        inspections_seed = [
            (1, "Sunshine Apartments", "A1", "Move-In", "2024-01-01", "Admin Inspector", "Passed", "All water taps flow check, locks functional, clean paint job.", ins_checklist_1),
            (2, "Sunshine Apartments", "A2", "Move-Out", "2025-06-15", "Admin Inspector", "Issues Found", "Living room wall has persistent moisture damages; living space window screen is torn.", ins_checklist_2)
        ]
        cursor.executemany("INSERT INTO inspections VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", inspections_seed)

        # Seed M-Pesa Transactions
        mpesa_seed = [
            ("MPESA-TR-001", "ws_CO_11061745_A23", "0712345678", 25000.0, "S231A90B3D", "Success", "2024-02-02T08:00:15Z", "John Doe")
        ]
        cursor.executemany("INSERT INTO mpesa_transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)", mpesa_seed)

        # Seed Vendors
        vendors_seed = [
            (1, "Nairobi Smart Plumbing Solutions", "0722222222", 4.8, 45, "Plumbing", "NCA-PL-9989"),
            (2, "Fast Electrics Contractors", "0733333333", 4.6, 38, "Electrical", "EPRA-EL-2311")
        ]
        cursor.executemany("INSERT INTO vendors VALUES (?, ?, ?, ?, ?, ?, ?)", vendors_seed)

        # Seed CRM Leads
        leads_seed = [
            (1, "David Kimani", "0711122233", "david@example.com", "Sunshine Apartments", "Residential", "Contacted", "Requests a ground-floor suite with high water flow."),
            (2, "Grace Wanjiku", "0722233344", "grace@example.com", "Business Plaza", "Commercial", "New Lead", "Interested in setting up a logistics office center.")
        ]
        cursor.executemany("INSERT INTO crm_leads VALUES (?, ?, ?, ?, ?, ?, ?, ?)", leads_seed)

        # Seed Assets
        assets_seed = [
            (1, "Sunshine Apartments", "Backup Generator 150kVA", "GEN-01", "2022-05-15", 1200000.0, "Straight Line", 10, 960000.0, "2023-11-20"),
            (2, "Business Plaza", "Main Water Intake Booster Pump", "PMP-01", "2023-01-10", 350000.0, "Straight Line", 5, 280000.0, "2024-01-15")
        ]
        cursor.executemany("INSERT INTO assets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", assets_seed)

        # Seed Audit Trail
        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'Admin User', 'System Initialize', 'Core multi-tenant ledger accounts, SQLite backend active, schema and assets seeded.')
        """, (datetime.datetime.utcnow().isoformat() + "Z",))

        # Seed Settings
        cursor.execute("""
        INSERT INTO settings (id, general, alerts)
        VALUES (1, ?, ?)
        """, (
            json.dumps({"companyName": "RealtyOS Ltd", "email": "admin@realtyos.com", "phone": "+254 700 000 000", "currency": "KES"}),
            json.dumps({"emailNotifications": True, "smsNotifications": False, "paymentReminders": True})
        ))

    conn.commit()
    conn.close()

def db_row_to_dict(row):
    if not row:
        return None
    d = dict(row)
    # Parse potential JSON strings safely
    for key, value in d.items():
        if isinstance(value, str):
            if (value.startswith("[") and value.endswith("]")) or (value.startswith("{") and value.endswith("}")):
                try:
                    d[key] = json.loads(value)
                except ValueError:
                    pass
    return d

def sanitize_text(val):
    if not isinstance(val, str):
        return ""
    # Strip HTML tags
    return re.sub(r'<[^>]*>', '', val).strip()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def options_handler(path):
    return '', 200

# Unified global data fetch
@app.route('/api/data', methods=['GET'])
def get_all_data():
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM properties")
        properties = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM tenants")
        tenants = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM units")
        units = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM expenses")
        expenses = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM recurring_expenses")
        recurringExpenses = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM invoices")
        invoices = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM payments")
        payments = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM maintenance")
        maintenance = [db_row_to_dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM settings WHERE id = 1")
        settings_row = cursor.fetchone()
        settings_dict = {}
        if settings_row:
            s_r = dict(settings_row)
            settings_dict = {
                "general": json.loads(s_r["general"]) if s_r["general"] else {},
                "alerts": json.loads(s_r["alerts"]) if s_r["alerts"] else {}
            }

        return jsonify({
            "properties": properties,
            "units": units,
            "tenants": tenants,
            "expenses": expenses,
            "recurringExpenses": recurringExpenses,
            "invoices": invoices,
            "payments": payments,
            "maintenance": maintenance,
            "settings": settings_dict
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- MODULE GETTERS ---
@app.route('/api/properties', methods=['GET'])
def get_properties():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/units', methods=['GET'])
def get_units():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM units")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/tenants', methods=['GET'])
def get_tenants():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tenants")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM invoices")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/payments', methods=['GET'])
def get_payments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM payments")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/leases', methods=['GET'])
def get_leases():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM leases")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/inspections', methods=['GET'])
def get_inspections():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM inspections")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/chart-of-accounts', methods=['GET'])
def get_chart_of_accounts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM chart_of_accounts")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/journal-entries', methods=['GET'])
def get_journal_entries():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM journal_entries")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/mpesa/transactions', methods=['GET'])
def get_mpesa_transactions():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mpesa_transactions")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/recurring-expenses', methods=['GET'])
def get_recurring_expenses():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recurring_expenses")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/maintenance', methods=['GET'])
def get_maintenance():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM maintenance")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/vendors', methods=['GET'])
def get_vendors():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vendors")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/crm-leads', methods=['GET'])
def get_crm_leads():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM crm_leads")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/assets', methods=['GET'])
def get_assets():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assets")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/audit-trail', methods=['GET'])
def get_audit_trail():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_trail ORDER BY id DESC")
    rows = [db_row_to_dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route('/api/settings', methods=['GET'])
def get_settings():
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM settings WHERE id = 1")
        settings_row = cursor.fetchone()
        settings_dict = {}
        if settings_row:
            s_r = dict(settings_row)
            settings_dict = {
                "general": json.loads(s_r["general"]) if s_r["general"] else {},
                "alerts": json.loads(s_r["alerts"]) if s_r["alerts"] else {}
            }
        return jsonify(settings_dict)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT balance FROM tenants")
        tenant_rows = cursor.fetchall()
        totalArrears = 0
        tenantsArrearsCount = 0
        totalAdvance = 0
        tenantsAdvanceCount = 0

        for row in tenant_rows:
            bal = row["balance"] or 0
            if bal > 0:
                totalArrears += bal
                tenantsArrearsCount += 1
            elif bal < 0:
                totalAdvance += abs(bal)
                tenantsAdvanceCount += 1

        cursor.execute("SELECT COUNT(*) FROM units")
        totalUnitsCount = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM units WHERE status='Occupied'")
        occupiedUnitsCount = cursor.fetchone()[0]

        occupancyRate = 0
        if totalUnitsCount > 0:
            occupancyRate = round((occupiedUnitsCount / totalUnitsCount) * 100, 1)

        return jsonify({
            "totalArrears": totalArrears,
            "tenantsArrearsCount": tenantsArrearsCount,
            "totalAdvance": totalAdvance,
            "tenantsAdvanceCount": tenantsAdvanceCount,
            "occupancyRate": occupancyRate,
            "totalUnits": totalUnitsCount,
            "occupiedUnits": occupiedUnitsCount
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- POST OPERATIONS ---
@app.route('/api/auth/login', methods=['POST'])
def login():
    body = request.get_json() or {}
    email = body.get("email", "").lower().strip()
    password = body.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email,))
        user = cursor.fetchone()
        if user:
            user_dict = dict(user)
            if user_dict["password"] == password:
                return jsonify({
                    "token": "mock-jwt-token-realtyos-secure",
                    "user": {
                        "id": user_dict["id"],
                        "name": user_dict["name"],
                        "role": user_dict["role"],
                        "email": user_dict["email"],
                        "username": user_dict["username"]
                    }
                })
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/properties', methods=['POST'])
def add_property():
    body = request.get_json() or {}
    name = sanitize_text(body.get("name", ""))
    address = sanitize_text(body.get("address", ""))
    city = sanitize_text(body.get("city", ""))
    streetName = sanitize_text(body.get("streetName", ""))
    waterRate = float(body.get("waterRate", 0))
    electricityRate = float(body.get("electricityRate", 0))
    prop_type = body.get("type", "Residential")
    units_qty = int(body.get("units", 0))

    if not name:
        return jsonify({"error": "Property name is required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        # Deduplicate check
        cursor.execute("SELECT id FROM properties WHERE LOWER(name) = ?", (name.lower(),))
        if cursor.fetchone():
            return jsonify({"error": f'A property with the name "{name}" already exists'}), 409

        prop_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO properties (id, name, address, city, streetName, waterRate, electricityRate, type, units, occupancy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        """, (prop_id, name, address, city, streetName, waterRate, electricityRate, prop_type, units_qty))
        
        # Audit Trail
        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'Admin User', 'Property Created', ?)
        """, (datetime.datetime.utcnow().isoformat() + "Z", f"Added property: {name}"))

        conn.commit()
        return jsonify({"id": prop_id, "name": name, "address": address, "city": city, "streetName": streetName, "waterRate": waterRate, "electricityRate": electricityRate, "type": prop_type, "units": units_qty, "occupancy": 0}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/units', methods=['POST'])
def add_units():
    body = request.get_json() or {}
    payloads = body if isinstance(body, list) else [body]
    processed_units = []

    conn = get_db()
    cursor = conn.cursor()
    try:
        for item in payloads:
            propertyId = item.get("propertyId")
            name = sanitize_text(item.get("name", ""))
            rentAmount = float(item.get("rentAmount", 0))

            if not propertyId or not name:
                return jsonify({"error": "Unit Name and Property are required"}), 400

            cursor.execute("SELECT name, type FROM properties WHERE id = ?", (propertyId,))
            prop = cursor.fetchone()
            if not prop:
                return jsonify({"error": f"Associated property ID {propertyId} does not exist"}), 400

            prop_name = prop["name"]
            prop_type = prop["type"]

            # Duplicate check
            cursor.execute("SELECT id FROM units WHERE propertyId = ? AND LOWER(name) = ?", (propertyId, name.lower()))
            if cursor.fetchone():
                return jsonify({"error": f'Unit "{name}" already exists in "{prop_name}"'}), 409

            unit_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000 + len(processed_units)
            cursor.execute("""
            INSERT INTO units (id, propertyId, propertyName, name, rentAmount, status, type)
            VALUES (?, ?, ?, ?, ?, 'Vacant', ?)
            """, (unit_id, propertyId, prop_name, name, rentAmount, prop_type))

            processed_units.append({
                "id": unit_id,
                "propertyId": propertyId,
                "propertyName": prop_name,
                "name": name,
                "rentAmount": rentAmount,
                "status": "Vacant",
                "type": prop_type
            })

        conn.commit()
        return jsonify(processed_units), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/tenants', methods=['POST'])
def add_tenants():
    body = request.get_json() or {}
    payloads = body if isinstance(body, list) else [body]
    processed_tenants = []

    conn = get_db()
    cursor = conn.cursor()
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
                cursor.execute("SELECT * FROM units WHERE id = ?", (unitId,))
                target_unit = cursor.fetchone()
            else:
                cursor.execute("SELECT * FROM units WHERE propertyName = ? AND name = ?", (property_name, unit_name))
                target_unit = cursor.fetchone()

            if not target_unit:
                return jsonify({"error": f"Unit in property is not registered"}), 400

            t_unit = dict(target_unit)
            if t_unit["status"] == "Occupied":
                return jsonify({"error": f'Unit "{t_unit["name"]}" in "{t_unit["propertyName"]}" is currently occupied'}), 409

            # Insert Tenant
            tenant_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000 + len(processed_tenants)
            lease_end = leaseEndDate or (datetime.date.today() + datetime.timedelta(days=365)).isoformat()
            avatar = item.get("avatarUrl", f"https://i.pravatar.cc/150?u={name}")

            cursor.execute("""
            INSERT INTO tenants (id, name, email, phone, property, propertyId, unit, unitId, leaseEndDate, status, avatarUrl, balance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, 0)
            """, (tenant_id, name, email, phone, t_unit["propertyName"], t_unit["propertyId"], t_unit["name"], t_unit["id"], lease_end, avatar))

            # Update unit status to Occupied
            cursor.execute("UPDATE units SET status = 'Occupied' WHERE id = ?", (t_unit["id"],))

            processed_tenants.append({
                "id": tenant_id,
                "name": name,
                "email": email,
                "phone": phone,
                "property": t_unit["propertyName"],
                "propertyId": t_unit["propertyId"],
                "unit": t_unit["name"],
                "unitId": t_unit["id"],
                "status": "Active",
                "leaseEndDate": lease_end,
                "avatarUrl": avatar,
                "balance": 0.0
            })

        conn.commit()
        return jsonify(processed_tenants), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/leases', methods=['POST'])
def add_lease():
    body = request.get_json() or {}
    tenantId = int(body.get("tenantId"))
    unitId = int(body.get("unitId"))
    startDate = body.get("startDate")
    endDate = body.get("endDate")
    rentEsc = float(body.get("rentEscalationPercentage", 0))
    secDep = float(body.get("securityDepositAmount", 0))
    coTenants = body.get("coTenants", [])
    guarantor = body.get("guarantorName", "")

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM tenants WHERE id = ?", (tenantId,))
        tenant = cursor.fetchone()
        cursor.execute("SELECT * FROM units WHERE id = ?", (unitId,))
        unit = cursor.fetchone()

        if not tenant or not unit:
            return jsonify({"error": "Tenant or Unit not found"}), 404

        t_dict = dict(tenant)
        u_dict = dict(unit)

        lease_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO leases (id, tenantId, tenantName, unitId, unitName, startDate, endDate, status, rentEscalationPercentage, securityDepositAmount, signatureStatus, signedDate, coTenants, guarantorName)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?, 'Signed', ?, ?, ?)
        """, (lease_id, tenantId, t_dict["name"], unitId, u_dict["name"], startDate, endDate, rentEsc, secDep, datetime.date.today().isoformat(), json.dumps(coTenants), guarantor))

        # Deposit Escrow accounting logic
        if secDep > 0:
            cursor.execute("UPDATE chart_of_accounts SET balance = balance + ? WHERE code = '1010'", (secDep,))
            cursor.execute("UPDATE chart_of_accounts SET balance = balance + ? WHERE code = '2010'", (secDep,))
            
            je_lines = json.dumps([
                {"accountCode": "1010", "accountName": "Bank Account (Current)", "debit": secDep, "credit": 0},
                {"accountCode": "2010", "accountName": "Tenant Security Deposits", "debit": 0, "credit": secDep}
            ])
            cursor.execute("""
            INSERT INTO journal_entries (id, date, reference, description, lines)
            VALUES (?, ?, ?, ?, ?)
            """, (f"JE-DEP-{lease_id % 10000}", datetime.date.today().isoformat(), f"LEASE-DEP-{lease_id}", f"Security deposit escrow transfer for Unit {u_dict['name']}", je_lines))

        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'Admin User', 'Lease Created', ?)
        """, (datetime.datetime.utcnow().isoformat() + "Z", f"New lease active for Tenant {t_dict['name']} in Unit {u_dict['name']}"))

        conn.commit()
        return jsonify({
            "id": lease_id,
            "tenantId": tenantId,
            "tenantName": t_dict["name"],
            "unitId": unitId,
            "unitName": u_dict["name"],
            "startDate": startDate,
            "endDate": endDate,
            "status": "Active",
            "rentEscalationPercentage": rentEsc,
            "securityDepositAmount": secDep,
            "signatureStatus": "Signed",
            "signedDate": datetime.date.today().isoformat(),
            "coTenants": coTenants,
            "guarantorName": guarantor
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    body = request.get_json() or {}
    property_name = sanitize_text(body.get("property", ""))
    amount = float(body.get("amount", 0))
    date = body.get("date") or datetime.date.today().isoformat()
    status = body.get("status", "Paid")
    category = body.get("category", "Other")

    conn = get_db()
    cursor = conn.cursor()
    try:
        exp_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO expenses (id, property, amount, date, status, category)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (exp_id, property_name, amount, date, status, category))
        conn.commit()
        return jsonify({"id": exp_id, "property": property_name, "amount": amount, "date": date, "status": status, "category": category}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/recurring-expenses', methods=['POST'])
def add_recurring_expense():
    body = request.get_json() or {}
    property_name = sanitize_text(body.get("property", ""))
    amount = float(body.get("amount", 0))
    frequency = body.get("frequency", "Monthly")

    conn = get_db()
    cursor = conn.cursor()
    try:
        rec_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO recurring_expenses (id, property, amount, frequency, status)
        VALUES (?, ?, ?, ?, 'Active')
        """, (rec_id, property_name, amount, frequency))
        conn.commit()
        return jsonify({"id": rec_id, "property": property_name, "amount": amount, "frequency": frequency, "status": "Active"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/invoices', methods=['POST'])
def add_invoice():
    body = request.get_json() or {}
    tenantId = body.get("tenantId")
    amount = float(body.get("amount", 0))
    dueDate = body.get("dueDate")
    invoiceNo = body.get("invoiceNumber", f"INV-{int(datetime.datetime.now().timestamp()) % 1000000}")
    description = sanitize_text(body.get("description", "Rent Extra charge"))

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM tenants WHERE id = ?", (tenantId,))
        tenant_row = cursor.fetchone()
        if not tenant_row:
            return jsonify({"error": "Tenant not found"}), 404

        t_dict = dict(tenant_row)

        # Duplicate invoice number check
        cursor.execute("SELECT id FROM invoices WHERE LOWER(invoiceNumber) = ?", (invoiceNo.lower(),))
        if cursor.fetchone():
            return jsonify({"error": f'An invoice with number "{invoiceNo}" already exists'}), 409

        invoice_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        due = dueDate or (datetime.date.today() + datetime.timedelta(days=14)).isoformat()

        cursor.execute("""
        INSERT INTO invoices (id, date, dueDate, invoiceNumber, tenantName, item, amount, status, tenantId, property, unit)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
        """, (invoice_id, datetime.date.today().isoformat(), due, invoiceNo, t_dict["name"], description, amount, t_dict["id"], t_dict["property"], t_dict["unit"]))

        # Update tenant balance (Arrears goes UP)
        cursor.execute("UPDATE tenants SET balance = balance + ? WHERE id = ?", (amount, t_dict["id"]))

        conn.commit()
        return jsonify({
            "id": invoice_id,
            "date": datetime.date.today().isoformat(),
            "dueDate": due,
            "invoiceNumber": invoiceNo,
            "tenantId": t_dict["id"],
            "tenantName": t_dict["name"],
            "property": t_dict["property"],
            "unit": t_dict["unit"],
            "item": description,
            "amount": amount,
            "status": "pending"
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/payments', methods=['POST'])
def add_payment():
    body = request.get_json() or {}
    tenantName = body.get("tenantName")
    amount = float(body.get("amount", 0))
    paymentId = body.get("paymentId", f"PAY-{int(datetime.datetime.now().timestamp()) % 1000000}")
    method = body.get("method", "MPESA")
    date = body.get("date") or datetime.date.today().isoformat()

    if not tenantName or amount <= 0:
        return jsonify({"error": "Tenant name and positive amount are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        # Deduplicate payment check
        cursor.execute("SELECT id FROM payments WHERE LOWER(paymentId) = ?", (paymentId.lower(),))
        if cursor.fetchone():
            return jsonify({"error": f'A transaction with reference "{paymentId}" has already been processed'}), 409

        cursor.execute("SELECT * FROM tenants WHERE LOWER(name) = ?", (tenantName.lower(),))
        tenant_row = cursor.fetchone()
        if not tenant_row:
            return jsonify({"error": f'No active tenant matches the name "{tenantName}"'}), 404

        t_dict = dict(tenant_row)

        # Insert Payment records
        pay_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO payments (id, date, paymentId, tenantName, propertyName, unitName, amount, method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
        """, (pay_id, date, paymentId, t_dict["name"], t_dict["property"], t_dict["unit"], amount, method))

        # Deduct from tenant balance
        cursor.execute("UPDATE tenants SET balance = balance - ? WHERE id = ?", (amount, t_dict["id"]))

        # FIFO Invoice Settlement
        cursor.execute("SELECT * FROM invoices WHERE LOWER(tenantName) = ? AND status = 'pending' ORDER BY date ASC", (tenantName.lower(),))
        pending_invoices = cursor.fetchall()

        remaining_payment = amount
        for inv in pending_invoices:
            if remaining_payment <= 0:
                break
            inv_dict = dict(inv)
            inv_amount = inv_dict["amount"]

            if remaining_payment >= inv_amount:
                remaining_payment -= inv_amount
                cursor.execute("UPDATE invoices SET status = 'paid' WHERE id = ?", (inv_dict["id"],))
            else:
                cursor.execute("UPDATE invoices SET amount = amount - ? WHERE id = ?", (remaining_payment, inv_dict["id"]))
                remaining_payment = 0

        conn.commit()
        return jsonify({
            "id": pay_id,
            "paymentId": paymentId,
            "tenantName": t_dict["name"],
            "propertyName": t_dict["property"],
            "unitName": t_dict["unit"],
            "amount": amount,
            "method": method,
            "status": "confirmed",
            "date": date
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/maintenance', methods=['POST'])
def add_maintenance():
    body = request.get_json() or {}
    property_name = sanitize_text(body.get("property", ""))
    unit_name = sanitize_text(body.get("unit", ""))
    summary = sanitize_text(body.get("summary", body.get("description", "General repair request")))
    category = sanitize_text(body.get("category", "General"))
    date = body.get("date") or datetime.date.today().isoformat()

    conn = get_db()
    cursor = conn.cursor()
    try:
        m_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO maintenance (id, summary, propertyName, unitName, status, category, expense, date)
        VALUES (?, ?, ?, ?, 'Open', ?, 0, ?)
        """, (m_id, summary, property_name, unit_name, category, date))
        conn.commit()
        return jsonify({
            "id": m_id,
            "summary": summary,
            "propertyName": property_name,
            "unitName": unit_name,
            "status": "Open",
            "category": category,
            "expense": 0.0,
            "date": date
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/journal-entries', methods=['POST'])
def add_journal_entry():
    body = request.get_json() or {}
    date = body.get("date") or datetime.date.today().isoformat()
    reference = sanitize_text(body.get("reference", ""))
    description = sanitize_text(body.get("description", ""))
    lines = body.get("lines", [])

    if not reference or len(lines) < 2:
        return jsonify({"error": "Reference and at least two journal ledger lines are required"}), 400

    # Balances assertions
    total_debit = sum(float(l.get("debit", 0)) for l in lines)
    total_credit = sum(float(l.get("credit", 0)) for l in lines)

    if abs(total_debit - total_credit) > 0.01:
        return jsonify({"error": f"Double-entry unbalance error. Total Debits (KES {total_debit}) must precisely match Total Credits (KES {total_credit})"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        # Update Account Portfolios
        for line in lines:
            code = line.get("accountCode")
            debit = float(line.get("debit", 0))
            credit = float(line.get("credit", 0))

            cursor.execute("SELECT * FROM chart_of_accounts WHERE code = ?", (code,))
            coa = cursor.fetchone()
            if not coa:
                return jsonify({"error": f"Chart of account code {code} does not exist inside organization portfolio"}), 400
            
            coa_dict = dict(coa)
            if coa_dict["type"] in ["Asset", "Expense"]:
                cursor.execute("UPDATE chart_of_accounts SET balance = balance + ? WHERE code = ?", (debit - credit, code))
            else:
                cursor.execute("UPDATE chart_of_accounts SET balance = balance + ? WHERE code = ?", (credit - debit, code))

        je_id = f"JE-MAN-{int(datetime.datetime.now().timestamp()) % 10000}"
        cursor.execute("""
        INSERT INTO journal_entries (id, date, reference, description, lines)
        VALUES (?, ?, ?, ?, ?)
        """, (je_id, date, reference, description, json.dumps(lines)))

        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'Admin User', 'Journal Accrual Raised', ?)
        """, (datetime.datetime.utcnow().isoformat() + "Z", f"Manual adjustment {reference} balancing KES {total_debit} entered."))

        conn.commit()
        return jsonify({
            "id": je_id,
            "date": date,
            "reference": reference,
            "description": description,
            "lines": lines
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/mpesa/c2b-simulate', methods=['POST'])
def mpesa_c2b_simulate():
    body = request.get_json() or {}
    phoneNumber = sanitize_text(body.get("phoneNumber", ""))
    amount = float(body.get("amount", 0))
    receiptNo = sanitize_text(body.get("mpesaReceiptNumber", "")).upper()
    tenantId = body.get("tenantId")

    if not phoneNumber or amount <= 0 or not receiptNo:
        return jsonify({"error": "Simulated M-PESA parameters (phone, amount, Receipt Ref) are required."}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        # Deduplicate check
        cursor.execute("SELECT id FROM mpesa_transactions WHERE mpesaReceiptNumber = ?", (receiptNo,))
        if cursor.fetchone():
            return jsonify({"error": f"Transaction {receiptNo} already exists in paybill log."}), 409

        # Find tenant by ID or Phone
        target_tenant = None
        if tenantId:
            cursor.execute("SELECT * FROM tenants WHERE id = ?", (int(tenantId),))
            target_tenant = cursor.fetchone()
        else:
            # phone similarities matching
            clean_phone = re.sub(r'[^0-9]', '', phoneNumber)
            cursor.execute("SELECT * FROM tenants")
            all_tenants = cursor.fetchall()
            for t in all_tenants:
                t_d = dict(t)
                clean_t_phone = re.sub(r'[^0-9]', '', t_d["phone"])
                if clean_phone in clean_t_phone or clean_t_phone in clean_phone:
                    target_tenant = t
                    break

        if not target_tenant:
            return jsonify({"error": "Reconciliation match failed. No active tenant found with matching credentials. Transaction routed to Suspense Account."}), 404

        t_dict = dict(target_tenant)

        # Decrease balance
        cursor.execute("UPDATE tenants SET balance = balance - ? WHERE id = ?", (amount, t_dict["id"]))

        # FIFO Settling
        cursor.execute("SELECT * FROM invoices WHERE LOWER(tenantName) = ? AND status = 'pending' ORDER BY date ASC", (t_dict["name"].lower(),))
        pending_invoices = cursor.fetchall()

        unspent = amount
        settlements_num = 0
        for inv in pending_invoices:
            if unspent <= 0:
                break
            inv_dict = dict(inv)
            inv_amount = inv_dict["amount"]

            if unspent >= inv_amount:
                unspent -= inv_amount
                cursor.execute("UPDATE invoices SET status = 'paid' WHERE id = ?", (inv_dict["id"],))
                settlements_num += 1
            else:
                cursor.execute("UPDATE invoices SET amount = amount - ? WHERE id = ?", (unspent, inv_dict["id"]))
                unspent = 0

        # Insert payment reference
        pay_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO payments (id, date, paymentId, tenantName, propertyName, unitName, amount, method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'MPESA', 'confirmed')
        """, (pay_id, datetime.date.today().isoformat(), receiptNo, t_dict["name"], t_dict["property"], t_dict["unit"], amount))

        # Double Entry ledger settlement
        cursor.execute("UPDATE chart_of_accounts SET balance = balance + ? WHERE code = '1010'", (amount,))
        cursor.execute("UPDATE chart_of_accounts SET balance = balance - ? WHERE code = '1020'", (amount,))

        je_lines = json.dumps([
            {"accountCode": "1010", "accountName": "Bank Account (Current)", "debit": amount, "credit": 0},
            {"accountCode": "1020", "accountName": "Accounts Receivable", "debit": 0, "credit": amount}
        ])
        cursor.execute("""
        INSERT INTO journal_entries (id, date, reference, description, lines)
        VALUES (?, ?, ?, ?, ?)
        """, (f"JE-MPESA-{int(datetime.datetime.now().timestamp()) % 10000}", datetime.date.today().isoformat(), receiptNo, f"Automatic system C2B MPESA settlement for tenant {t_dict['name']}", je_lines))

        # Log M-Pesa records
        tr_id = f"MPESA-TR-{int(datetime.datetime.now().timestamp()) % 10000}"
        cursor.execute("""
        INSERT INTO mpesa_transactions (id, checkoutRequestId, phoneNumber, amount, mpesaReceiptNumber, status, timestamp, tenantName)
        VALUES (?, ?, ?, ?, ?, 'Success', ?, ?)
        """, (tr_id, f"sim_ws_{int(datetime.datetime.now().timestamp()) % 100000}", phoneNumber, amount, receiptNo, datetime.datetime.utcnow().isoformat() + "Z", t_dict["name"]))

        # Log Audit Log
        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'M-PESA Webhook Receiver', 'MPESA Settlement Received', ?)
        """, (datetime.datetime.utcnow().isoformat() + "Z", f"Receipt {receiptNo} cleared KES {amount} for tenant {t_dict['name']}. Ledger in total reconciliation."))

        conn.commit()
        return jsonify({
            "message": "Callback simulation processed perfectly.",
            "transaction": {
                "id": tr_id,
                "checkoutRequestId": f"sim_ws_{int(datetime.datetime.now().timestamp()) % 100000}",
                "phoneNumber": phoneNumber,
                "amount": amount,
                "mpesaReceiptNumber": receiptNo,
                "status": "Success",
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "tenantName": t_dict["name"]
            },
            "tenantMatched": t_dict["name"],
            "invoiceSettlements": settlements_num
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/crm-leads', methods=['POST'])
def add_crm_lead():
    body = request.get_json() or {}
    name = sanitize_text(body.get("name", ""))
    phone = sanitize_text(body.get("phone", ""))
    email = sanitize_text(body.get("email", ""))
    prop_interest = sanitize_text(body.get("propertyInterest", "Sunshine Apartments"))
    note = sanitize_text(body.get("note", "Created via lead capturing pipeline."))

    if not name or not phone:
        return jsonify({"error": "Lead Name and Phone are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        lead_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        cursor.execute("""
        INSERT INTO crm_leads (id, name, phone, email, propertyInterest, preferredType, status, note)
        VALUES (?, ?, ?, ?, ?, 'Residential', 'New Lead', ?)
        """, (lead_id, name, phone, email, prop_interest, note))
        conn.commit()
        return jsonify({
            "id": lead_id,
            "name": name,
            "phone": phone,
            "email": email,
            "propertyInterest": prop_interest,
            "preferredType": "Residential",
            "status": "New Lead",
            "note": note
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/ocr/analyze', methods=['POST'])
def run_ocr_analyze():
    body = request.get_json() or {}
    text = body.get("textToAnalyze", "").lower()
    fileName = sanitize_text(body.get("fileName", "scanned_lease_contract.txt"))

    if not text:
        return jsonify({"error": "Document body text must be supplied to analyze metadata."}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        # NLP parser matches
        detected_tenant = "John Doe"
        rent_amount = 25000.0
        if "smith" in text:
            detected_tenant = "Jane Smith"
        elif "kimani" in text:
            detected_tenant = "David Kimani"
        elif "wanjiku" in text:
            detected_tenant = "Grace Wanjiku"

        rent_match = re.search(r'kes\s?(\d+[\d,]*)', text) or re.search(r'rent\s?:\s?(\d+[\d,]*)', text) or re.search(r'shillings\s?(\d+[\d,]*)', text)
        if rent_match:
            try:
                rent_amount = float(rent_match.group(1).replace(",", ""))
            except ValueError:
                pass

        ocr_id = f"OCR-{int(datetime.datetime.now().timestamp()) % 10000}"
        cursor.execute("""
        INSERT INTO ocr_documents (id, fileName, size, dateAnalyzed, parsedAmount, confidence, tenantDetected, leasePeriod)
        VALUES (?, ?, '154KB', ?, ?, 95.8, ?, '12 Months')
        """, (ocr_id, fileName, datetime.date.today().isoformat(), rent_amount, detected_tenant))

        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'Document Intelligence AI Engine', 'Lease OCR Parsed', ?)
        """, (datetime.datetime.utcnow().isoformat() + "Z", f"Analyzed scanned document {fileName}. Extracted tenant {detected_tenant} with rent allowance KES {rent_amount}."))

        conn.commit()
        return jsonify({
            "id": ocr_id,
            "fileName": fileName,
            "size": "154KB",
            "dateAnalyzed": datetime.date.today().isoformat(),
            "parsedAmount": rent_amount,
            "confidence": 95.8,
            "tenantDetected": detected_tenant,
            "leasePeriod": "12 Months"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/settings', methods=['POST'])
def save_settings():
    body = request.get_json() or {}
    general = body.get("general", {})
    alerts = body.get("alerts", {})

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM settings WHERE id = 1")
        if cursor.fetchone():
            cursor.execute("""
            UPDATE settings SET general = ?, alerts = ? WHERE id = 1
            """, (json.dumps(general), json.dumps(alerts)))
        else:
            cursor.execute("""
            INSERT INTO settings (id, general, alerts) VALUES (1, ?, ?)
            """, (json.dumps(general), json.dumps(alerts)))
        conn.commit()
        return jsonify({"general": general, "alerts": alerts})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# --- PUT MUTATIONS ---
@app.route('/api/tenants/<int:tenant_id>', methods=['PUT'])
def update_tenant(tenant_id):
    body = request.get_json() or {}
    status = body.get("status")
    lease_end = body.get("leaseEndDate")

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM tenants WHERE id = ?", (tenant_id,))
        tenant = cursor.fetchone()

        if not tenant:
            return jsonify({"error": "Tenant not found"}), 404

        t_dict = dict(tenant)

        if status in ["Inactive", "Move-out", "Move-Out"]:
            cursor.execute("UPDATE tenants SET status = 'Inactive', leaseEndDate = ? WHERE id = ?", (lease_end or t_dict["leaseEndDate"], tenant_id))
            # update unit status to Vacant
            cursor.execute("UPDATE units SET status = 'Vacant' WHERE id = ?", (t_dict["unitId"],))
        else:
            new_status = status or t_dict["status"]
            cursor.execute("UPDATE tenants SET status = ? WHERE id = ?", (new_status, tenant_id))

        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'Admin User', 'Tenant Update', ?)
        """, (datetime.datetime.utcnow().isoformat() + "Z", f"Updated tenant {t_dict['name']} status to {status or t_dict['status']}."))

        conn.commit()
        
        cursor.execute("SELECT * FROM tenants WHERE id = ?", (tenant_id,))
        updated_tenant = db_row_to_dict(cursor.fetchone())
        return jsonify(updated_tenant)
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/leases/<int:lease_id>', methods=['PUT'])
def update_lease(lease_id):
    body = request.get_json() or {}
    status = sanitize_text(body.get("status", ""))
    rentEsc = body.get("rentEscalationPercentage")

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM leases WHERE id = ?", (lease_id,))
        lease = cursor.fetchone()

        if not lease:
            return jsonify({"error": "Lease agreement not found"}), 404

        l_dict = dict(lease)
        final_status = status if status else l_dict["status"]
        final_rent_esc = float(rentEsc) if rentEsc is not None else float(l_dict["rentEscalationPercentage"])

        cursor.execute("UPDATE leases SET status = ?, rentEscalationPercentage = ? WHERE id = ?", (final_status, final_rent_esc, lease_id))

        cursor.execute("""
        INSERT INTO audit_trail (timestamp, user, action, details)
        VALUES (?, 'Admin User', 'Lease Modified', ?)
        """, (datetime.datetime.utcnow().isoformat() + "Z", f"Renewed/Updated lease ID: {lease_id} to status {final_status}"))

        conn.commit()

        cursor.execute("SELECT * FROM leases WHERE id = ?", (lease_id,))
        updated_lease = db_row_to_dict(cursor.fetchone())
        return jsonify(updated_lease)
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not Found"}), 404
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    return app.send_static_file("index.html")


if __name__ == "__main__":
    init_db()
    print(f"Starting realtyOS Flask backend on 0.0.0.0:{PORT}...")
    app.run(host="0.0.0.0", port=PORT, debug=False)
