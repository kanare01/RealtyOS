
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import joinedload
from app.extensions import db
from app.models import Payment, MpesaTransaction, Billing, Message, RecurringExpense, Property, Tenant, Unit
from app.schemas import *
from app.services import RecurringService, MpesaService
from app.utils import manager_required, admin_required, log_system_action
from datetime import datetime

finance_bp = Blueprint('finance', __name__)

# --- Payments ---
@finance_bp.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    # Eager load tenant, property, unit
    payments = Payment.query.options(
        joinedload(Payment.tenant), 
        joinedload(Payment.property_obj), 
        joinedload(Payment.unit_obj)
    ).order_by(Payment.date.desc()).all()
    return jsonify(PaymentSchema(many=True).dump(payments))

@finance_bp.route('/payments', methods=['POST'])
@jwt_required()
def add_payment():
    data = request.json
    tenant_name = data.get('tenantName')
    
    tenant = Tenant.query.filter_by(name=tenant_name).first()
    if not tenant:
        prop = Property.query.filter_by(name=data.get('propertyName')).first()
        if prop:
            unit = Unit.query.filter_by(name=data.get('unitName'), property_id=prop.id).first()
            if unit:
                tenant = Tenant.query.filter_by(unit_id=unit.id).first()

    new_pay = Payment(
        amount=data['amount'],
        payment_id=data.get('paymentId'),
        date=data.get('date'),
        method=data.get('method'),
        status=data.get('status', 'confirmed'),
        tenant_id=tenant.id if tenant else None,
        property_id=tenant.property_id if tenant else None,
        unit_id=tenant.unit_id if tenant else None
    )
    
    if tenant and new_pay.status == 'confirmed':
        tenant.balance = (tenant.balance or 0) - new_pay.amount

    db.session.add(new_pay)
    db.session.commit()
    
    log_system_action('created payment', f"Recorded payment {new_pay.payment_id} of {new_pay.amount}")
    
    return jsonify(PaymentSchema().dump(new_pay)), 201

@finance_bp.route('/payments/<int:id>', methods=['PUT'])
@jwt_required()
@manager_required
def update_payment(id):
    pay = Payment.query.get_or_404(id)
    data = request.json
    
    # Balance Reconciliation Logic
    # 1. Reverse the effect of the OLD amount on the tenant's balance
    if pay.tenant and pay.status == 'confirmed':
        pay.tenant.balance = (pay.tenant.balance or 0) + pay.amount

    # 2. Update fields
    pay.date = data.get('date', pay.date)
    pay.amount = float(data.get('amount', pay.amount))
    pay.method = data.get('method', pay.method)
    pay.payment_id = data.get('paymentId', pay.payment_id)
    
    # 3. Apply the effect of the NEW amount
    if pay.tenant and pay.status == 'confirmed':
        pay.tenant.balance = (pay.tenant.balance or 0) - pay.amount

    db.session.commit()
    log_system_action('updated payment', f"Updated payment {pay.payment_id}")
    return jsonify(PaymentSchema().dump(pay))

@finance_bp.route('/payments/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_payment(id):
    pay = Payment.query.get_or_404(id)
    pay_id = pay.payment_id
    if pay.tenant and pay.status == 'confirmed':
        pay.tenant.balance = (pay.tenant.balance or 0) + pay.amount
        
    db.session.delete(pay)
    db.session.commit()
    log_system_action('deleted payment', f"Deleted payment {pay_id}")
    return jsonify({"message": "Deleted"}), 200

# --- Recurring Expenses Logic ---
@finance_bp.route('/recurring-expenses', methods=['GET'])
@jwt_required()
def get_recurring_expenses():
    recs = RecurringExpense.query.all()
    return jsonify(RecurringExpenseSchema(many=True).dump(recs))

@finance_bp.route('/recurring-expenses', methods=['POST'])
@jwt_required()
@manager_required
def create_recurring_expense():
    data = request.json
    prop = Property.query.filter_by(name=data.get('property')).first()
    
    new_rec = RecurringExpense(
        description=data['description'],
        amount=data['amount'],
        frequency=data['frequency'],
        next_due_date=data['nextDueDate'],
        category=data.get('category'),
        property_id=prop.id if prop else None,
        status='Active'
    )
    db.session.add(new_rec)
    db.session.commit()
    return jsonify(RecurringExpenseSchema().dump(new_rec)), 201

@finance_bp.route('/recurring-expenses/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
@manager_required
def recurring_expense_detail(id):
    rec = RecurringExpense.query.get_or_404(id)
    if request.method == 'DELETE':
        db.session.delete(rec)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
        
    data = request.json
    rec.description = data.get('description', rec.description)
    rec.amount = data.get('amount', rec.amount)
    rec.frequency = data.get('frequency', rec.frequency)
    rec.next_due_date = data.get('nextDueDate', rec.next_due_date)
    rec.status = data.get('status', rec.status)
    rec.category = data.get('category', rec.category)
    
    db.session.commit()
    return jsonify(RecurringExpenseSchema().dump(rec))

@finance_bp.route('/recurring-expenses/process', methods=['POST'])
@jwt_required()
def process_recurring():
    count = RecurringService.process_due_expenses()
    return jsonify({"processed_count": count})

# --- MPESA ---
@finance_bp.route('/mpesa/transactions', methods=['GET'])
@jwt_required()
def get_mpesa_transactions():
    txs = MpesaTransaction.query.order_by(MpesaTransaction.id.desc()).all()
    return jsonify(MpesaTransactionSchema(many=True).dump(txs))

@finance_bp.route('/mpesa/stkpush', methods=['POST'])
@jwt_required()
def stk_push():
    data = request.json
    ref = MpesaService.process_stk_push(
        amount=data.get('amount'), 
        phone=data.get('phone'), 
        account_ref=data.get('accountReference')
    )
    return jsonify({"success": True, "CheckoutRequestID": ref})

# Public callback (No JWT Required)
@finance_bp.route('/mpesa/simulate-callback', methods=['POST'])
def mpesa_callback():
    data = request.json
    reconciled, tx = MpesaService.process_callback(
        phone=data.get('phone'),
        amount=float(data.get('amount')),
        ref_number=data.get('reference') or "REF" + str(int(datetime.now().timestamp())),
        account_ref=data.get('accountReference')
    )
    return jsonify({
        "success": True, 
        "reconciled": reconciled,
        "transaction": MpesaTransactionSchema().dump(tx)
    })

# --- Billing ---
@finance_bp.route('/billing', methods=['GET'])
@jwt_required()
@manager_required
def get_billing():
    bill = Billing.query.first()
    if not bill:
        bill = Billing(sms_balance=0, subscription_due=0)
        db.session.add(bill)
        db.session.commit()
    return jsonify(BillingSchema().dump(bill))

@finance_bp.route('/billing/topup', methods=['POST'])
@jwt_required()
@manager_required
def topup():
    data = request.json
    bill = Billing.query.first()
    if not bill:
        bill = Billing()
        db.session.add(bill)
    
    if data.get('item') == 'sms':
        bill.sms_balance += float(data.get('amount', 0))
    elif data.get('item') == 'subscription':
        bill.subscription_due = 0
        bill.subscription_expiry = "2025-12-31" 
    
    db.session.commit()
    return jsonify(BillingSchema().dump(bill))

# --- Messages ---
@finance_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    msgs = Message.query.order_by(Message.id.desc()).all()
    return jsonify(MessageSchema(many=True).dump(msgs))

@finance_bp.route('/messages/send', methods=['POST'])
@jwt_required()
def send_message():
    data = request.json
    bill = Billing.query.first()
    
    if data.get('type') == 'SMS':
        cost = 1.0
        if not bill or bill.sms_balance < cost:
            return jsonify({"error": "Insufficient SMS Balance"}), 402
        bill.sms_balance -= cost
    
    msg = Message(
        recipient=data.get('recipient'),
        recipient_group=data.get('recipientGroup'),
        type=data.get('type'),
        content=data.get('content'),
        status='Delivered',
        date=datetime.now().strftime('%Y-%m-%d %H:%M'),
        property_name=data.get('property'),
        unit_name=data.get('unit')
    )
    db.session.add(msg)
    db.session.commit()
    log_system_action('sent message', f"Sent {msg.type} to {msg.recipient}")
    return jsonify({"success": True, "data": MessageSchema().dump(msg), "new_balance": bill.sms_balance if bill else 0}), 201

@finance_bp.route('/messages/<int:id>', methods=['PUT'])
@jwt_required()
@manager_required
def update_message(id):
    msg = Message.query.get_or_404(id)
    data = request.json
    if 'status' in data:
        msg.status = data['status']
    db.session.commit()
    return jsonify(MessageSchema().dump(msg))

@finance_bp.route('/messages/<int:id>', methods=['DELETE'])
@jwt_required()
@manager_required
def delete_message(id):
    msg = Message.query.get_or_404(id)
    db.session.delete(msg)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
