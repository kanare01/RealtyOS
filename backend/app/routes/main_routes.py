
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
from sqlalchemy import text
from app.extensions import db
from app.models import (
    Property, Unit, Tenant, Invoice, InvoiceItem, Expense, 
    RecurringExpense, MaintenanceRequest, PropertyGrouping, 
    Utility, TeamMember, AuditLog, SystemSetting, Feedback
)
from app.schemas import *
from app.services import DashboardService
from app.utils import role_required, admin_required, manager_required, log_system_action
from app.tasks import generate_monthly_rent, check_reminders, process_recurring_expenses
from datetime import datetime

main_bp = Blueprint('main', __name__)

@main_bp.route('/health', methods=['GET'])
def health_check():
    """
    Public health check endpoint for monitoring and accessibility verification.
    """
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "RealtyOS API"
    }), 200

# --- System & Maintenance ---
@main_bp.route('/feedback', methods=['GET'])
@jwt_required()
@admin_required
def get_feedback():
    items = Feedback.query.order_by(Feedback.id.desc()).all()
    return jsonify(FeedbackSchema(many=True).dump(items))

@main_bp.route('/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    data = request.json
    user_id = get_jwt_identity()
    user = TeamMember.query.get(user_id)
    
    feedback = Feedback(
        type=data.get('type', 'General'),
        message=data.get('message', ''),
        user_id=user.id,
        created_at=datetime.now().strftime('%Y-%m-%d %H:%M')
    )
    
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify({"message": "Feedback received successfully"}), 201

@main_bp.route('/system/maintenance', methods=['POST'])
@jwt_required()
@admin_required
def system_maintenance():
    action = request.json.get('action')
    message = "Action completed"
    
    if action == 'prune_logs':
        # Keep last 1000 logs
        subquery = db.session.query(AuditLog.id).order_by(AuditLog.id.desc()).limit(1000).subquery()
        db.session.query(AuditLog).filter(AuditLog.id.notin_(subquery)).delete(synchronize_session=False)
        db.session.commit()
        message = "Old audit logs pruned."
    elif action == 'clear_cache':
        # Simulate cache clearing
        message = "System cache cleared."
    else:
        return jsonify({"error": "Invalid action"}), 400
        
    log_system_action('maintenance', message)
    return jsonify({"message": message}), 200

@main_bp.route('/system/jobs/trigger', methods=['POST'])
@jwt_required()
@admin_required
def trigger_job():
    job_id = request.json.get('job_id')
    
    try:
        if job_id == 'monthly_rent':
            generate_monthly_rent()
            message = "Monthly rent generation triggered."
        elif job_id == 'daily_reminders':
            check_reminders()
            message = "Daily reminders check triggered."
        elif job_id == 'daily_expenses':
            process_recurring_expenses()
            message = "Recurring expenses processing triggered."
        else:
            return jsonify({"error": "Invalid Job ID"}), 400
            
        log_system_action('trigger job', f"Manually triggered job: {job_id}")
        return jsonify({"message": message}), 200
    except Exception as e:
        current_app.logger.error(f"Job Trigger Failed: {e}")
        return jsonify({"error": str(e)}), 500

@main_bp.route('/system/status', methods=['GET'])
@jwt_required()
@admin_required
def system_status():
    # 1. Check Database
    try:
        db.session.execute(text('SELECT 1'))
        db_status = "Online"
    except Exception as e:
        db_status = f"Offline: {str(e)}"

    # 2. Check Scheduler
    scheduler = current_app.extensions.get('scheduler')
    scheduler_status = "Running" if scheduler and scheduler.running else "Stopped"
    
    jobs_data = []
    if scheduler:
        for job in scheduler.get_jobs():
            jobs_data.append({
                "id": job.id,
                "next_run_time": str(job.next_run_time) if job.next_run_time else "Paused",
                "func_name": job.func_ref
            })

    return jsonify({
        "database": db_status,
        "scheduler": scheduler_status,
        "jobs": jobs_data,
        "server_time": datetime.now().isoformat(),
        "version": "1.1.0"
    })

# --- Settings ---
@main_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_settings():
    settings = SystemSetting.query.all()
    # Return as key-value pair for frontend convenience
    settings_dict = {s.key: s.value for s in settings}
    return jsonify(settings_dict)

@main_bp.route('/settings', methods=['POST'])
@jwt_required()
@admin_required
def update_settings():
    data = request.json
    updated_keys = []
    
    for key, value in data.items():
        setting = SystemSetting.query.get(key)
        if not setting:
            setting = SystemSetting(key=key)
            db.session.add(setting)
        
        setting.value = str(value) # Store as string
        setting.updated_at = datetime.now().isoformat()
        updated_keys.append(key)
    
    db.session.commit()
    log_system_action('updated settings', f"Updated system settings: {', '.join(updated_keys)}")
    return jsonify({"message": "Settings updated successfully"}), 200

# --- Dashboard Stats ---
@main_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def dashboard_stats():
    stats = DashboardService.get_stats()
    return jsonify(stats)

# --- Properties ---
@main_bp.route('/properties', methods=['GET'])
@jwt_required()
def get_properties():
    props = Property.query.all()
    return jsonify(PropertySchema(many=True).dump(props))

@main_bp.route('/properties', methods=['POST'])
@jwt_required()
@manager_required
def create_property():
    data = request.json
    new_prop = Property(
        name=data['name'],
        address=data.get('address'),
        city=data.get('city'),
        street_name=data.get('streetName'),
        type=data.get('type', 'Residential'),
        units_count=data.get('units', 0),
        occupancy=data.get('occupancy', 0),
        image_url=data.get('imageUrl'),
        water_rate=data.get('waterRate', 0),
        electricity_rate=data.get('electricityRate', 0),
        mpesa_type=data.get('mpesaType'),
        paybill_number=data.get('paybillNumber'),
        penalty_type=data.get('penaltyType'),
        tax_rate=data.get('taxRate', 0),
        management_fee_type=data.get('managementFeeType'),
        company_name=data.get('companyName'),
        notes=data.get('notes'),
        payment_instructions=data.get('paymentInstructions'),
        owner_phone=data.get('ownerPhone'),
        recurring_bills=data.get('recurringBills', [])
    )
    db.session.add(new_prop)
    db.session.commit()
    log_system_action('created property', f"Created property {new_prop.name}")
    return jsonify(PropertySchema().dump(new_prop)), 201

@main_bp.route('/properties/<int:id>', methods=['PUT'])
@jwt_required()
@manager_required
def update_property(id):
    prop = Property.query.get_or_404(id)
    data = request.json
    prop.name = data.get('name', prop.name)
    prop.address = data.get('address', prop.address)
    prop.city = data.get('city', prop.city)
    prop.units_count = data.get('units', prop.units_count)
    prop.water_rate = data.get('waterRate', prop.water_rate)
    prop.electricity_rate = data.get('electricityRate', prop.electricity_rate)
    prop.recurring_bills = data.get('recurringBills', prop.recurring_bills)
    if 'mpesaType' in data: prop.mpesa_type = data['mpesaType']
    if 'paybillNumber' in data: prop.paybill_number = data['paybillNumber']
    
    db.session.commit()
    log_system_action('updated property', f"Updated property {prop.name}")
    return jsonify(PropertySchema().dump(prop))

@main_bp.route('/properties/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_property(id):
    prop = Property.query.get_or_404(id)
    name = prop.name
    db.session.delete(prop)
    db.session.commit()
    log_system_action('deleted property', f"Deleted property {name}")
    return jsonify({"message": "Deleted"}), 200

# --- Units ---
@main_bp.route('/units', methods=['GET'])
@jwt_required()
def get_units():
    units = Unit.query.options(joinedload(Unit.property_obj)).all()
    return jsonify(UnitSchema(many=True).dump(units))

@main_bp.route('/units', methods=['POST'])
@jwt_required()
@manager_required
def create_units():
    data = request.json
    
    # Bulk Create
    if isinstance(data, list):
        created_units = []
        for unit_data in data:
            prop_id = unit_data.get('propertyId')
            if not prop_id and unit_data.get('propertyName'):
                prop = Property.query.filter_by(name=unit_data['propertyName']).first()
                if prop: prop_id = prop.id
            
            if prop_id:
                new_unit = Unit(
                    name=unit_data['name'],
                    rent_amount=unit_data.get('rentAmount', 0),
                    property_id=prop_id,
                    category=unit_data.get('category'),
                    status='Vacant',
                    notes=unit_data.get('notes'),
                    recurring_bills=unit_data.get('recurringBills', [])
                )
                db.session.add(new_unit)
                created_units.append(new_unit)
        
        db.session.commit()
        log_system_action('created unit', f"Created {len(created_units)} units")
        return jsonify(UnitSchema(many=True).dump(created_units)), 201

    # Single Create
    prop_id = data.get('propertyId')
    if not prop_id and data.get('propertyName'):
        prop = Property.query.filter_by(name=data['propertyName']).first()
        if prop: prop_id = prop.id
    
    if not prop_id:
        return jsonify({"error": "Property ID required"}), 400
    
    new_unit = Unit(
        name=data['name'],
        rent_amount=data.get('rentAmount', 0),
        property_id=prop_id,
        category=data.get('category'),
        status='Vacant',
        notes=data.get('notes'),
        recurring_bills=data.get('recurringBills', [])
    )
    db.session.add(new_unit)
    db.session.commit()
    log_system_action('created unit', f"Created unit {new_unit.name}")
    return jsonify(UnitSchema().dump(new_unit)), 201

@main_bp.route('/units/<int:id>', methods=['PUT'])
@jwt_required()
@manager_required
def update_unit(id):
    unit = Unit.query.get_or_404(id)
    data = request.json
    unit.name = data.get('name', unit.name)
    unit.rent_amount = data.get('rentAmount', unit.rent_amount)
    unit.category = data.get('category', unit.category)
    unit.recurring_bills = data.get('recurringBills', unit.recurring_bills)
    db.session.commit()
    return jsonify(UnitSchema().dump(unit))

@main_bp.route('/units/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_unit(id):
    unit = Unit.query.get_or_404(id)
    db.session.delete(unit)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# --- Tenants ---
@main_bp.route('/tenants', methods=['GET'])
@jwt_required()
def get_tenants():
    tenants = Tenant.query.options(joinedload(Tenant.property_obj), joinedload(Tenant.unit_obj)).all()
    return jsonify(TenantSchema(many=True).dump(tenants))

@main_bp.route('/tenants', methods=['POST'])
@jwt_required()
def create_tenants():
    data = request.json
    
    if isinstance(data, list):
        created_tenants = []
        for t_data in data:
            prop = Property.query.filter_by(name=t_data.get('property')).first()
            if not prop: continue
            
            unit = Unit.query.filter_by(name=t_data.get('unit'), property_id=prop.id).first()
            if not unit: continue

            new_t = Tenant(
                name=t_data['name'],
                first_name=t_data.get('firstName'),
                last_name=t_data.get('lastName'),
                phone=t_data.get('phone'),
                email=t_data.get('email', 'N/A'),
                property_id=prop.id,
                unit_id=unit.id,
                balance=0
            )
            unit.status = 'Occupied'
            db.session.add(new_t)
            created_tenants.append(new_t)
        
        db.session.commit()
        log_system_action('created tenant', f"Bulk imported {len(created_tenants)} tenants")
        return jsonify(TenantSchema(many=True).dump(created_tenants)), 201

    prop = Property.query.filter_by(name=data.get('property')).first()
    if not prop and data.get('propertyId'):
        prop = Property.query.get(data['propertyId'])
        
    unit = Unit.query.filter_by(name=data.get('unit'), property_id=prop.id).first() if prop else None
    
    if not prop or not unit:
        return jsonify({"error": "Invalid Property or Unit"}), 400

    new_tenant = Tenant(
        name=data['name'],
        first_name=data.get('firstName'),
        last_name=data.get('lastName'),
        email=data.get('email'),
        phone=data.get('phone'),
        property_id=prop.id,
        unit_id=unit.id,
        balance=data.get('balance', 0),
        lease_start_date=data.get('leaseStartDate', 'N/A'),
        lease_end_date=data.get('leaseEndDate', 'N/A'),
        move_in_date=data.get('moveInDate'),
        move_out_date=data.get('moveOutDate'),
        deposit_type=data.get('depositType'),
        deposit_paid=data.get('depositPaid', 0),
        deposit_returned=data.get('depositReturned', 0),
        account_number=data.get('accountNumber'),
        national_id=data.get('nationalId'),
        kra_pin=data.get('kraPin'),
        penalty_type=data.get('penaltyType'),
        notes=data.get('notes'),
        other_phones=data.get('otherPhones', []),
        next_of_kin=data.get('nextOfKin', []),
        bank_payers=data.get('bankPayers', [])
    )
    
    unit.status = 'Occupied'
    
    db.session.add(new_tenant)
    db.session.commit()
    log_system_action('created tenant', f"Created tenant {new_tenant.name}")
    return jsonify(TenantSchema().dump(new_tenant)), 201

@main_bp.route('/tenants/<int:id>', methods=['PUT'])
@jwt_required()
def update_tenant(id):
    tenant = Tenant.query.get_or_404(id)
    data = request.json
    tenant.name = data.get('name', tenant.name)
    tenant.email = data.get('email', tenant.email)
    tenant.phone = data.get('phone', tenant.phone)
    tenant.balance = data.get('balance', tenant.balance)
    
    if data.get('unit') and data.get('unit') != tenant.unit_obj.name:
        old_unit = Unit.query.get(tenant.unit_id)
        new_unit = Unit.query.filter_by(name=data['unit'], property_id=tenant.property_id).first()
        if new_unit:
            if old_unit: old_unit.status = 'Vacant'
            tenant.unit_id = new_unit.id
            new_unit.status = 'Occupied'

    db.session.commit()
    log_system_action('updated tenant', f"Updated tenant {tenant.name}")
    return jsonify(TenantSchema().dump(tenant))

@main_bp.route('/tenants/<int:id>', methods=['DELETE'])
@jwt_required()
@manager_required
def delete_tenant(id):
    tenant = Tenant.query.get_or_404(id)
    unit = Unit.query.get(tenant.unit_id)
    if unit: unit.status = 'Vacant'
    
    db.session.delete(tenant)
    db.session.commit()
    log_system_action('deleted tenant', f"Deleted tenant {tenant.name}")
    return jsonify({"message": "Deleted"}), 200

# --- Invoices ---
@main_bp.route('/invoices', methods=['GET'])
@jwt_required()
def get_invoices():
    invoices = Invoice.query.options(joinedload(Invoice.tenant), joinedload(Invoice.items)).all()
    return jsonify(InvoiceSchema(many=True).dump(invoices))

@main_bp.route('/invoices', methods=['POST'])
@jwt_required()
def create_invoice():
    data = request.json
    tenant_name = data.get('tenantName')
    tenant = Tenant.query.filter_by(name=tenant_name).first()
    
    if not tenant:
        prop = Property.query.filter_by(name=data.get('property')).first()
        unit = Unit.query.filter_by(name=data.get('unit'), property_id=prop.id).first() if prop else None
        if unit:
            tenant = Tenant.query.filter_by(unit_id=unit.id).first()

    new_invoice = Invoice(
        invoice_number=data.get('invoiceNumber'),
        date=data.get('date'),
        due_date=data.get('dueDate'),
        total_amount=data.get('totalAmount'),
        status=data.get('status', 'Unpaid'),
        tenant_id=tenant.id if tenant else None,
        property_id=tenant.property_id if tenant else None,
        unit_id=tenant.unit_id if tenant else None
    )
    
    for item in data.get('items', []):
        new_item = InvoiceItem(
            description=item.get('description'),
            amount=item.get('amount')
        )
        new_invoice.items.append(new_item)
    
    if tenant:
        tenant.balance = (tenant.balance or 0) + new_invoice.total_amount

    db.session.add(new_invoice)
    db.session.commit()
    log_system_action('created invoice', f"Created invoice {new_invoice.invoice_number}")
    return jsonify(InvoiceSchema().dump(new_invoice)), 201

@main_bp.route('/invoices/<int:id>', methods=['PUT'])
@jwt_required()
def update_invoice(id):
    inv = Invoice.query.get_or_404(id)
    data = request.json
    if 'status' in data:
        inv.status = data['status']
    db.session.commit()
    return jsonify(InvoiceSchema().dump(inv))

@main_bp.route('/invoices/<int:id>', methods=['DELETE'])
@jwt_required()
@manager_required
def delete_invoice(id):
    inv = Invoice.query.get_or_404(id)
    if inv.status == 'Unpaid' and inv.tenant:
        inv.tenant.balance -= inv.total_amount
        
    db.session.delete(inv)
    db.session.commit()
    log_system_action('deleted invoice', f"Deleted invoice {inv.invoice_number}")
    return jsonify({"message": "Deleted"}), 200

# --- Expenses ---
@main_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    exps = Expense.query.options(joinedload(Expense.property_obj)).all()
    return jsonify(ExpenseSchema(many=True).dump(exps))

@main_bp.route('/expenses', methods=['POST'])
@jwt_required()
def create_expense():
    data = request.json
    prop = Property.query.filter_by(name=data.get('property')).first()
    
    new_exp = Expense(
        date=data['date'],
        amount=data['amount'],
        category=data.get('category'),
        description=data.get('description'),
        status=data.get('status', 'draft'),
        property_id=prop.id if prop else None
    )
    db.session.add(new_exp)
    db.session.commit()
    return jsonify(ExpenseSchema().dump(new_exp)), 201

@main_bp.route('/expenses/<int:id>', methods=['PUT'])
@jwt_required()
@manager_required
def update_expense(id):
    exp = Expense.query.get_or_404(id)
    data = request.json
    exp.date = data.get('date', exp.date)
    exp.amount = data.get('amount', exp.amount)
    exp.category = data.get('category', exp.category)
    exp.description = data.get('description', exp.description)
    exp.status = data.get('status', exp.status)
    db.session.commit()
    return jsonify(ExpenseSchema().dump(exp))

@main_bp.route('/expenses/<int:id>', methods=['DELETE'])
@jwt_required()
@manager_required
def delete_expense(id):
    exp = Expense.query.get_or_404(id)
    db.session.delete(exp)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# --- Maintenance ---
@main_bp.route('/maintenance', methods=['GET'])
@jwt_required()
def get_maintenance():
    reqs = MaintenanceRequest.query.all()
    return jsonify(MaintenanceRequestSchema(many=True).dump(reqs))

@main_bp.route('/maintenance', methods=['POST'])
@jwt_required()
def create_maintenance():
    data = request.json
    prop = Property.query.filter_by(name=data.get('propertyName')).first()
    
    new_req = MaintenanceRequest(
        title=data['title'],
        date=data.get('date'),
        property_id=prop.id if prop else None,
        priority=data.get('priority'),
        status=data.get('status'),
        category=data.get('category'),
        description=data.get('description'),
        assigned_to=data.get('assignedTo'),
        cost=data.get('cost', 0)
    )
    db.session.add(new_req)
    db.session.commit()
    return jsonify(MaintenanceRequestSchema().dump(new_req)), 201

@main_bp.route('/maintenance/<int:id>', methods=['PUT'])
@jwt_required()
def update_maintenance(id):
    req = MaintenanceRequest.query.get_or_404(id)
    data = request.json
    if 'status' in data: req.status = data['status']
    if 'cost' in data: req.cost = data['cost']
    db.session.commit()
    return jsonify(MaintenanceRequestSchema().dump(req))

@main_bp.route('/maintenance/<int:id>', methods=['DELETE'])
@jwt_required()
@manager_required
def delete_maintenance(id):
    req = MaintenanceRequest.query.get_or_404(id)
    db.session.delete(req)
    db.session.commit()
    log_system_action('deleted maintenance', f"Deleted maintenance request {req.title}")
    return jsonify({"message": "Deleted"}), 200
    
# --- Utilities ---
@main_bp.route('/utilities', methods=['GET'])
@jwt_required()
def get_utilities():
    utils = Utility.query.all()
    return jsonify(UtilitySchema(many=True).dump(utils))

@main_bp.route('/utilities', methods=['POST'])
@jwt_required()
def create_utility():
    data = request.json
    prop = Property.query.filter_by(name=data.get('propertyName')).first()
    unit = Unit.query.filter_by(name=data.get('unitName'), property_id=prop.id).first() if prop else None
    
    new_util = Utility(
        date=data.get('date'),
        type=data.get('type'),
        previous_reading=data.get('previousReading'),
        current_reading=data.get('currentReading'),
        consumption=data.get('consumption'),
        rate=data.get('rate'),
        amount=data.get('amount'),
        status=data.get('status', 'Uninvoiced'),
        property_id=prop.id if prop else None,
        unit_id=unit.id if unit else None
    )
    
    db.session.add(new_util)
    db.session.commit()
    return jsonify(UtilitySchema().dump(new_util)), 201

@main_bp.route('/utilities/<int:id>', methods=['PUT'])
@jwt_required()
def update_utility(id):
    util = Utility.query.get_or_404(id)
    data = request.json
    if 'status' in data: util.status = data['status']
    db.session.commit()
    return jsonify(UtilitySchema().dump(util))

@main_bp.route('/utilities/<int:id>', methods=['DELETE'])
@jwt_required()
@manager_required
def delete_utility(id):
    util = Utility.query.get_or_404(id)
    db.session.delete(util)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# --- Property Groupings ---
@main_bp.route('/property-groupings', methods=['GET'])
@jwt_required()
def get_property_groupings():
    groups = PropertyGrouping.query.all()
    return jsonify(PropertyGroupingSchema(many=True).dump(groups))

@main_bp.route('/property-groupings', methods=['POST'])
@jwt_required()
@manager_required
def create_property_grouping():
    data = request.json
    new_group = PropertyGrouping(
        name=data['name'],
        description=data.get('description'),
        manager_name=data.get('managerName')
    )
    if 'propertyIds' in data:
        props = Property.query.filter(Property.id.in_(data['propertyIds'])).all()
        new_group.properties.extend(props)
        
    db.session.add(new_group)
    db.session.commit()
    return jsonify(PropertyGroupingSchema().dump(new_group)), 201

@main_bp.route('/property-groupings/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
@manager_required
def property_grouping_detail(id):
    group = PropertyGrouping.query.get_or_404(id)
    if request.method == 'DELETE':
        db.session.delete(group)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    
    data = request.json
    group.name = data.get('name', group.name)
    group.description = data.get('description', group.description)
    group.manager_name = data.get('managerName', group.manager_name)
    
    if 'propertyIds' in data:
        group.properties = []
        props = Property.query.filter(Property.id.in_(data['propertyIds'])).all()
        group.properties.extend(props)
        
    db.session.commit()
    return jsonify(PropertyGroupingSchema().dump(group))

# --- Team Members (Settings) ---
@main_bp.route('/team-members', methods=['GET'])
@jwt_required()
@admin_required
def get_team_members():
    members = TeamMember.query.all()
    return jsonify(TeamMemberSchema(many=True).dump(members))

@main_bp.route('/team-members', methods=['POST'])
@jwt_required()
@admin_required
def create_team_member():
    data = request.json
    if TeamMember.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
        
    member = TeamMember(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        username=data.get('username'),
        role=data.get('role', 'Agent')
    )
    member.set_password(data.get('password', 'password123')) # Default password
    db.session.add(member)
    db.session.commit()
    log_system_action('created user', f"Created team member {member.username}")
    return jsonify(TeamMemberSchema().dump(member)), 201

@main_bp.route('/team-members/<int:id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_team_member(id):
    member = TeamMember.query.get_or_404(id)
    data = request.json
    member.name = data.get('name', member.name)
    member.phone = data.get('phone', member.phone)
    member.email = data.get('email', member.email)
    if 'role' in data:
        member.role = data['role']
    db.session.commit()
    log_system_action('updated user', f"Updated team member {member.username}")
    return jsonify(TeamMemberSchema().dump(member))

@main_bp.route('/team-members/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_team_member(id):
    member = TeamMember.query.get_or_404(id)
    username = member.username
    db.session.delete(member)
    db.session.commit()
    log_system_action('deleted user', f"Deleted team member {username}")
    return jsonify({"message": "Deleted"}), 200

# --- Audit Logs (Settings) ---
@main_bp.route('/audit-logs', methods=['GET'])
@jwt_required()
@admin_required
def get_audit_logs():
    logs = AuditLog.query.order_by(AuditLog.id.desc()).limit(100).all()
    return jsonify(AuditLogSchema(many=True).dump(logs))
