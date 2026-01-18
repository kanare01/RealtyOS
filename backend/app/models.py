
from datetime import datetime
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

# Association table for Property Groupings
grouping_properties = db.Table('grouping_properties',
    db.Column('grouping_id', db.Integer, db.ForeignKey('property_groupings.id'), primary_key=True),
    db.Column('property_id', db.Integer, db.ForeignKey('properties.id'), primary_key=True)
)

class Property(db.Model):
    __tablename__ = 'properties'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    street_name = db.Column(db.String(100))
    type = db.Column(db.String(50)) # Residential, Commercial
    units_count = db.Column(db.Integer, default=0)
    occupancy = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255))
    
    # Financial Settings
    water_rate = db.Column(db.Float, default=0.0)
    electricity_rate = db.Column(db.Float, default=0.0)
    mpesa_type = db.Column(db.String(20)) # Paybill/Till
    paybill_number = db.Column(db.String(20))
    penalty_type = db.Column(db.String(20))
    tax_rate = db.Column(db.Float, default=0.0)
    management_fee_type = db.Column(db.String(20))
    
    # Details
    company_name = db.Column(db.String(100))
    notes = db.Column(db.Text)
    payment_instructions = db.Column(db.Text)
    owner_phone = db.Column(db.String(20))
    recurring_bills = db.Column(db.JSON) # List of {type, amount}

    units = db.relationship('Unit', backref='property_obj', lazy=True, cascade="all, delete-orphan")
    tenants = db.relationship('Tenant', backref='property_obj', lazy=True)

class PropertyGrouping(db.Model):
    __tablename__ = 'property_groupings'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    manager_name = db.Column(db.String(100))
    properties = db.relationship('Property', secondary=grouping_properties, lazy='subquery',
        backref=db.backref('groupings', lazy=True))

class Unit(db.Model):
    __tablename__ = 'units'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    rent_amount = db.Column(db.Float, nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    status = db.Column(db.String(20), default='Vacant') # Vacant, Occupied
    category = db.Column(db.String(50)) # 1B, 2B, Shop
    notes = db.Column(db.Text)
    tax_rate = db.Column(db.Float, default=0.0)
    recurring_bills = db.Column(db.JSON) # List of {type, amount}

    tenant = db.relationship('Tenant', backref='unit_obj', uselist=False, lazy=True)

class Tenant(db.Model):
    __tablename__ = 'tenants'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'))
    
    balance = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='Active')
    lease_start_date = db.Column(db.String(20))
    lease_end_date = db.Column(db.String(20))
    move_in_date = db.Column(db.String(20))
    move_out_date = db.Column(db.String(20))
    avatar_url = db.Column(db.String(255))
    
    # Details
    deposit_type = db.Column(db.String(50))
    deposit_paid = db.Column(db.Float, default=0.0)
    deposit_returned = db.Column(db.Float, default=0.0)
    account_number = db.Column(db.String(50))
    national_id = db.Column(db.String(20))
    kra_pin = db.Column(db.String(20))
    penalty_type = db.Column(db.String(20))
    notes = db.Column(db.Text)
    
    # JSON fields
    other_phones = db.Column(db.JSON)
    next_of_kin = db.Column(db.JSON)
    bank_payers = db.Column(db.JSON)

    invoices = db.relationship('Invoice', backref='tenant', lazy=True)
    payments = db.relationship('Payment', backref='tenant', lazy=True)
    documents = db.relationship('Document', backref='tenant', lazy=True)

class Invoice(db.Model):
    __tablename__ = 'invoices'
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), unique=True)
    date = db.Column(db.String(20))
    due_date = db.Column(db.String(20))
    total_amount = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='Unpaid') # Paid, Unpaid, Pending, Overdue
    
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'))
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'))
    
    items = db.relationship('InvoiceItem', backref='invoice', lazy=True, cascade="all, delete-orphan")

class InvoiceItem(db.Model):
    __tablename__ = 'invoice_items'
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'), nullable=False)
    description = db.Column(db.String(200))
    amount = db.Column(db.Float)

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.String(50)) # Reference/Transaction ID
    date = db.Column(db.String(20))
    amount = db.Column(db.Float)
    method = db.Column(db.String(50)) # Mpesa, Bank, Cash
    status = db.Column(db.String(20), default='confirmed')
    
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'))
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'))

class Expense(db.Model):
    __tablename__ = 'expenses'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20))
    amount = db.Column(db.Float)
    category = db.Column(db.String(50))
    description = db.Column(db.String(255))
    status = db.Column(db.String(20)) # draft, confirmed
    
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'), nullable=True)
    
    property_obj = db.relationship('Property', backref='expenses')
    unit_obj = db.relationship('Unit', backref='expenses')

class RecurringExpense(db.Model):
    __tablename__ = 'recurring_expenses'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255))
    amount = db.Column(db.Float)
    frequency = db.Column(db.String(20)) # Monthly, Quarterly, Yearly
    next_due_date = db.Column(db.String(20))
    category = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Active')
    
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'), nullable=True)
    
    property_obj = db.relationship('Property')

class Utility(db.Model):
    __tablename__ = 'utilities'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20))
    type = db.Column(db.String(50)) # Water, Electricity
    previous_reading = db.Column(db.Float)
    current_reading = db.Column(db.Float)
    consumption = db.Column(db.Float)
    rate = db.Column(db.Float)
    amount = db.Column(db.Float)
    status = db.Column(db.String(20), default='Uninvoiced')
    
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'))
    
    property_obj = db.relationship('Property')
    unit_obj = db.relationship('Unit')

class MaintenanceRequest(db.Model):
    __tablename__ = 'maintenance_requests'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    date = db.Column(db.String(20))
    priority = db.Column(db.String(20))
    status = db.Column(db.String(20))
    category = db.Column(db.String(50))
    description = db.Column(db.Text)
    assigned_to = db.Column(db.String(100))
    cost = db.Column(db.Float, default=0.0)
    
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'), nullable=True)
    
    property_obj = db.relationship('Property')
    unit_obj = db.relationship('Unit')

class MpesaTransaction(db.Model):
    __tablename__ = 'mpesa_transactions'
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), unique=True)
    shortcode = db.Column(db.String(20))
    amount = db.Column(db.Float)
    phone = db.Column(db.String(20))
    date = db.Column(db.String(30))
    status = db.Column(db.String(20))
    description = db.Column(db.String(255))
    tenant_name_snapshot = db.Column(db.String(100)) # Snapshot at time of tx

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    recipient = db.Column(db.String(100))
    recipient_group = db.Column(db.String(50)) # Tenant, Team, All
    type = db.Column(db.String(20)) # SMS, Email
    content = db.Column(db.Text)
    status = db.Column(db.String(20))
    date = db.Column(db.String(30))
    
    property_name = db.Column(db.String(100))
    unit_name = db.Column(db.String(50))

class Billing(db.Model):
    __tablename__ = 'billing'
    id = db.Column(db.Integer, primary_key=True)
    sms_balance = db.Column(db.Float, default=0.0)
    subscription_due = db.Column(db.Float, default=0.0)
    subscription_expiry = db.Column(db.String(20))

class TeamMember(db.Model):
    __tablename__ = 'team_members'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120), unique=True)
    username = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(256))
    role = db.Column(db.String(20), default='Agent')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50))
    description = db.Column(db.String(255))
    username = db.Column(db.String(50))
    date = db.Column(db.String(30))
    ip_address = db.Column(db.String(20))

class SystemSetting(db.Model):
    __tablename__ = 'system_settings'
    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.Text) # JSON string or plain text
    updated_at = db.Column(db.String(30))

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50)) # General, Bug Report, Feature Request
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='New') # New, Reviewed, Closed
    user_id = db.Column(db.Integer, db.ForeignKey('team_members.id'))
    created_at = db.Column(db.String(30))
    
    user = db.relationship('TeamMember', backref='feedback')

class Document(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    file_url = db.Column(db.String(255))
    category = db.Column(db.String(50)) # lease, notice, receipt
    upload_date = db.Column(db.String(30))
    
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'), nullable=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=True)
    
    property_obj = db.relationship('Property', backref='documents')
