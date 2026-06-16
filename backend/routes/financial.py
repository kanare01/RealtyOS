import datetime
from flask import Blueprint, request, jsonify
from backend.models.financial import Invoice, Payment, ChartOfAccount, JournalEntry, MpesaTransaction, Expense, RecurringExpense
from backend.models.tenant import Tenant
from backend.services.accounting_service import AccountingService
from backend.services.mpesa_service import MpesaService
from backend.extensions import sanitize_text

financial_bp = Blueprint('financial', __name__)

# --- INVOICES ---
@financial_bp.route('/api/invoices', methods=['GET'])
def get_invoices():
    return jsonify(Invoice.get_all())

@financial_bp.route('/api/invoices', methods=['POST'])
def add_invoice():
    body = request.get_json() or {}
    tenantId = body.get("tenantId")
    amount = float(body.get("amount", 0))
    dueDate = body.get("dueDate")
    invoiceNo = body.get("invoiceNumber", f"INV-{int(datetime.datetime.now().timestamp()) % 1000000}")
    description = sanitize_text(body.get("description", "Rent Extra charge"))

    try:
        tenant = Tenant.get_by_id(tenantId)
        if not tenant:
            return jsonify({"error": "Tenant not found"}), 404

        existing = Invoice.get_by_number(invoiceNo)
        if existing:
            return jsonify({"error": f'An invoice with number "{invoiceNo}" already exists'}), 409

        invoice_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        due = dueDate or (datetime.date.today() + datetime.timedelta(days=14)).isoformat()

        # Update Tenant Balance in DB
        Tenant.update_balance(tenantId, amount)

        # Create Invoice
        invoice = Invoice.create(
            invoice_id=invoice_id,
            date=datetime.date.today().isoformat(),
            due_date=due,
            invoice_no=invoiceNo,
            tenant_name=tenant["name"],
            item=description,
            amount=amount,
            status="pending",
            tenant_id=tenant["id"],
            property_name=tenant["property"],
            unit_name=tenant["unit"]
        )

        return jsonify(invoice), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- PAYMENTS ---
@financial_bp.route('/api/payments', methods=['GET'])
def get_payments():
    return jsonify(Payment.get_all())

@financial_bp.route('/api/payments', methods=['POST'])
def add_payment():
    body = request.get_json() or {}
    tenantName = body.get("tenantName")
    amount = float(body.get("amount", 0))
    paymentId = body.get("paymentId", f"PAY-{int(datetime.datetime.now().timestamp()) % 1000000}")
    method = body.get("method", "MPESA")
    date = body.get("date") or datetime.date.today().isoformat()

    if not tenantName or amount <= 0:
        return jsonify({"error": "Tenant name and positive amount are required"}), 400

    try:
        existing = Payment.get_by_payment_id(paymentId)
        if existing:
            return jsonify({"error": f'A transaction with reference "{paymentId}" has already been processed'}), 409

        tenant = Tenant.get_by_name(tenantName)
        if not tenant:
            return jsonify({"error": f'No active tenant matches the name "{tenantName}"'}), 404

        # Deduct from tenant balance
        Tenant.update_balance(tenant["id"], -amount)

        # FIFO invoice settling
        pending_invoices = Invoice.get_pending_by_tenant(tenantName)
        remaining_payment = amount
        for inv in pending_invoices:
            if remaining_payment <= 0:
                break
            inv_amount = inv["amount"]

            if remaining_payment >= inv_amount:
                remaining_payment -= inv_amount
                Invoice.update_status(inv["id"], "paid")
            else:
                Invoice.update_amount_due(inv["id"], remaining_payment)
                remaining_payment = 0

        # Create payment records
        pay_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        payment = Payment.create(
            pay_id=pay_id,
            date=date,
            payment_id=paymentId,
            tenant_name=tenant["name"],
            property_name=tenant["property"],
            unit_name=tenant["unit"],
            amount=amount,
            method=method,
            status="confirmed"
        )

        return jsonify(payment), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- CHART OF ACCOUNTS & JOURNAL ENTRIES ---
@financial_bp.route('/api/chart-of-accounts', methods=['GET'])
def get_chart_of_accounts():
    return jsonify(ChartOfAccount.get_all())

@financial_bp.route('/api/journal-entries', methods=['GET'])
def get_journal_entries():
    return jsonify(JournalEntry.get_all())

@financial_bp.route('/api/journal-entries', methods=['POST'])
def add_journal_entry():
    body = request.get_json() or {}
    date = body.get("date") or datetime.date.today().isoformat()
    reference = sanitize_text(body.get("reference", ""))
    description = sanitize_text(body.get("description", ""))
    lines = body.get("lines", [])

    if not reference or len(lines) < 2:
        return jsonify({"error": "Reference and at least two journal ledger lines are required"}), 400

    try:
        je_id = f"JE-MAN-{int(datetime.datetime.now().timestamp()) % 10000}"
        je = AccountingService.record_manual_accrual(
            je_id=je_id,
            date=date,
            reference=reference,
            description=description,
            lines=lines
        )
        return jsonify(je), 201
    except ValueError as val_err:
        return jsonify({"error": str(val_err)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- M-PESA SIMULATION & TRANSACTIONS ---
@financial_bp.route('/api/mpesa/transactions', methods=['GET'])
def get_mpesa_transactions():
    return jsonify(MpesaTransaction.get_all())

@financial_bp.route('/api/mpesa/c2b-simulate', methods=['POST'])
def mpesa_c2b_simulate():
    body = request.get_json() or {}
    phoneNumber = sanitize_text(body.get("phoneNumber", ""))
    amount = float(body.get("amount", 0))
    receiptNo = sanitize_text(body.get("mpesaReceiptNumber", "")).upper()
    tenantId = body.get("tenantId")

    if not phoneNumber or amount <= 0 or not receiptNo:
        return jsonify({"error": "Simulated M-PESA parameters (phone, amount, Receipt Ref) are required."}), 400

    try:
        res = MpesaService.simulate_c2b_deposit(
            phone_number=phoneNumber,
            amount=amount,
            receipt_no=receiptNo,
            tenant_id=tenantId
        )
        return jsonify(res), 201
    except KeyError as key_err:
        return jsonify({"error": str(key_err)}), 409
    except ValueError as val_err:
        return jsonify({"error": str(val_err)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- EXPENSES ---
@financial_bp.route('/api/expenses', methods=['GET'])
def get_expenses():
    return jsonify(Expense.get_all())

@financial_bp.route('/api/expenses', methods=['POST'])
def add_expense():
    body = request.get_json() or {}
    property_name = sanitize_text(body.get("property", ""))
    amount = float(body.get("amount", 0))
    date = body.get("date") or datetime.date.today().isoformat()
    status = body.get("status", "Paid")
    category = body.get("category", "Other")

    try:
        exp_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        expense = Expense.create(
            expense_id=exp_id,
            property_name=property_name,
            amount=amount,
            date=date,
            status=status,
            category=category
        )
        return jsonify(expense), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- RECURRING EXPENSES ---
@financial_bp.route('/api/recurring-expenses', methods=['GET'])
def get_recurring_expenses():
    return jsonify(RecurringExpense.get_all())

@financial_bp.route('/api/recurring-expenses', methods=['POST'])
def add_recurring_expense():
    body = request.get_json() or {}
    property_name = sanitize_text(body.get("property", ""))
    amount = float(body.get("amount", 0))
    frequency = body.get("frequency", "Monthly")

    try:
        rec_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
        rec_exp = RecurringExpense.create(
            rec_id=rec_id,
            property_name=property_name,
            amount=amount,
            frequency=frequency,
            status="Active"
        )
        return jsonify(rec_exp), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
