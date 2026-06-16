import json
from backend.models import BaseModel
from backend.extensions import db

class Expense(BaseModel):
    table_name = "expenses"

    @classmethod
    def create(cls, expense_id, property_name, amount, date, status, category):
        query = """
        INSERT INTO expenses (id, property, amount, date, status, category)
        VALUES (?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (expense_id, property_name, amount, date, status, category))
        return cls.get_by_id(expense_id)


class RecurringExpense(BaseModel):
    table_name = "recurring_expenses"

    @classmethod
    def create(cls, rec_id, property_name, amount, frequency, status="Active"):
        query = """
        INSERT INTO recurring_expenses (id, property, amount, frequency, status)
        VALUES (?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (rec_id, property_name, amount, frequency, status))
        return cls.get_by_id(rec_id)


class Invoice(BaseModel):
    table_name = "invoices"

    @classmethod
    def get_by_number(cls, invoice_no):
        return db.fetch_one("SELECT * FROM invoices WHERE LOWER(invoiceNumber) = ?", (invoice_no.lower().strip(),))

    @classmethod
    def get_pending_by_tenant(cls, tenant_name):
        return db.fetch_all("SELECT * FROM invoices WHERE LOWER(tenantName) = ? AND status = 'pending' ORDER BY date ASC", (tenant_name.lower().strip(),))

    @classmethod
    def create(cls, invoice_id, date, due_date, invoice_no, tenant_name, item, amount, status, tenant_id, property_name, unit_name):
        query = """
        INSERT INTO invoices (id, date, dueDate, invoiceNumber, tenantName, item, amount, status, tenantId, property, unit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (invoice_id, date, due_date, invoice_no, tenant_name, item, amount, status, tenant_id, property_name, unit_name))
        return cls.get_by_id(invoice_id)

    @classmethod
    def update_status(cls, invoice_id, status):
        query = "UPDATE invoices SET status = ? WHERE id = ?"
        db.execute_and_commit(query, (status, invoice_id))

    @classmethod
    def update_amount_due(cls, invoice_id, amount_deducted):
        query = "UPDATE invoices SET amount = amount - ? WHERE id = ?"
        db.execute_and_commit(query, (amount_deducted, invoice_id))


class Payment(BaseModel):
    table_name = "payments"

    @classmethod
    def get_by_payment_id(cls, payment_id):
        return db.fetch_one("SELECT * FROM payments WHERE LOWER(paymentId) = ?", (payment_id.lower().strip(),))

    @classmethod
    def create(cls, pay_id, date, payment_id, tenant_name, property_name, unit_name, amount, method, status="confirmed"):
        query = """
        INSERT INTO payments (id, date, paymentId, tenantName, propertyName, unitName, amount, method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (pay_id, date, payment_id, tenant_name, property_name, unit_name, amount, method, status))
        return cls.get_by_id(pay_id)


class ChartOfAccount(BaseModel):
    table_name = "chart_of_accounts"

    @classmethod
    def get_by_code(cls, code):
        return db.fetch_one("SELECT * FROM chart_of_accounts WHERE code = ?", (code,))

    @classmethod
    def update_balance(cls, code, debit_minus_credit, is_asset_or_expense=True):
        if is_asset_or_expense:
            query = "UPDATE chart_of_accounts SET balance = balance + ? WHERE code = ?"
        else:
            query = "UPDATE chart_of_accounts SET balance = balance + ? WHERE code = ?"
        db.execute_and_commit(query, (debit_minus_credit, code))


class JournalEntry(BaseModel):
    table_name = "journal_entries"

    @classmethod
    def get_by_id(cls, je_id):
        return db.fetch_one("SELECT * FROM journal_entries WHERE id = ?", (je_id,))

    @classmethod
    def create(cls, je_id, date, reference, description, lines):
        lines_json = json.dumps(lines)
        query = """
        INSERT INTO journal_entries (id, date, reference, description, lines)
        VALUES (?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (je_id, date, reference, description, lines_json))
        return cls.get_by_id(je_id)


class MpesaTransaction(BaseModel):
    table_name = "mpesa_transactions"

    @classmethod
    def get_by_receipt(cls, receipt_no):
        return db.fetch_one("SELECT * FROM mpesa_transactions WHERE mpesaReceiptNumber = ?", (receipt_no.upper().strip(),))

    @classmethod
    def create(cls, tr_id, checkout_id, phone, amount, receipt_no, timestamp, tenant_name, status="Success"):
        query = """
        INSERT INTO mpesa_transactions (id, checkoutRequestId, phoneNumber, amount, mpesaReceiptNumber, status, timestamp, tenantName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        db.execute_and_commit(query, (tr_id, checkout_id, phone, amount, receipt_no.upper().strip(), status, timestamp, tenant_name))
        return cls.get_by_id(tr_id)
