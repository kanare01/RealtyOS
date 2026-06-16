import datetime
import json
from backend.extensions import db

def init_db():
    conn = db.get_connection()
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
