import re
import datetime
import json
from backend.extensions import db
from backend.models.tenant import Tenant
from backend.models.financial import Invoice, Payment, ChartOfAccount, JournalEntry, MpesaTransaction
from backend.models.operations import AuditTrail

class MpesaService:
    @classmethod
    def simulate_c2b_deposit(cls, phone_number, amount, receipt_no, tenant_id=None):
        receipt_no = receipt_no.upper().strip()
        
        # Check database de-duplication
        existing = MpesaTransaction.get_by_receipt(receipt_no)
        if existing:
            raise KeyError(f"Transaction {receipt_no} already exists in paybill log.")

        conn = db.get_connection()
        cursor = conn.cursor()
        try:
            target_tenant = None
            if tenant_id:
                cursor.execute("SELECT * FROM tenants WHERE id = ?", (int(tenant_id),))
                row = cursor.fetchone()
                if row:
                    target_tenant = dict(row)
            else:
                # Phone similarities matching
                clean_phone = re.sub(r'[^0-9]', '', phone_number)
                cursor.execute("SELECT * FROM tenants")
                row_list = cursor.fetchall()
                for r in row_list:
                    t_d = dict(r)
                    clean_t_phone = re.sub(r'[^0-9]', '', t_d["phone"])
                    if clean_phone in clean_t_phone or clean_t_phone in clean_phone:
                        target_tenant = t_d
                        break

            if not target_tenant:
                raise ValueError("Reconciliation match failed. No active tenant found with matching credentials. Transaction routed to Suspense Account.")

            # 1. Decrease tenant balance by the payment amount (in advance/paid credit)
            cursor.execute("UPDATE tenants SET balance = balance - ? WHERE id = ?", (amount, target_tenant["id"]))

            # 2. FIFO Settle Pending Invoices
            cursor.execute("SELECT * FROM invoices WHERE LOWER(tenantName) = ? AND status = 'pending' ORDER BY date ASC", (target_tenant["name"].lower(),))
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

            # 3. Create core Payment entry
            pay_id = int(datetime.datetime.now().timestamp() * 1000) % 10000000
            cursor.execute("""
            INSERT INTO payments (id, date, paymentId, tenantName, propertyName, unitName, amount, method, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'MPESA', 'confirmed')
            """, (pay_id, datetime.date.today().isoformat(), receipt_no, target_tenant["name"], target_tenant["property"], target_tenant["unit"], amount))

            # 4. Global Ledger Double Entry modifications (+Bank Account 1010, -Accounts Receivable 1020)
            cursor.execute("UPDATE chart_of_accounts SET balance = balance + ? WHERE code = '1010'", (amount,))
            cursor.execute("UPDATE chart_of_accounts SET balance = balance - ? WHERE code = '1020'", (amount,))

            je_id = f"JE-MPESA-{int(datetime.datetime.now().timestamp()) % 10000}"
            je_lines_json = json.dumps([
                {"accountCode": "1010", "accountName": "Bank Account (Current)", "debit": amount, "credit": 0},
                {"accountCode": "1020", "accountName": "Accounts Receivable", "debit": 0, "credit": amount}
            ])
            cursor.execute("""
            INSERT INTO journal_entries (id, date, reference, description, lines)
            VALUES (?, ?, ?, ?, ?)
            """, (je_id, datetime.date.today().isoformat(), receipt_no, f"Automatic system C2B MPESA settlement for tenant {target_tenant['name']}", je_lines_json))

            # 5. Insert MPESA logs
            tr_id = f"MPESA-TR-{int(datetime.datetime.now().timestamp()) % 10000}"
            tr_timestamp = datetime.datetime.utcnow().isoformat() + "Z"
            cursor.execute("""
            INSERT INTO mpesa_transactions (id, checkoutRequestId, phoneNumber, amount, mpesaReceiptNumber, status, timestamp, tenantName)
            VALUES (?, ?, ?, ?, ?, 'Success', ?, ?)
            """, (tr_id, f"sim_ws_{int(datetime.datetime.now().timestamp()) % 100000}", phone_number, amount, receipt_no, tr_timestamp, target_tenant["name"]))

            # 6. Auditing log
            cursor.execute("""
            INSERT INTO audit_trail (timestamp, user, action, details)
            VALUES (?, 'M-PESA Webhook Receiver', 'MPESA Settlement Received', ?)
            """, (datetime.datetime.utcnow().isoformat() + "Z", f"Receipt {receipt_no} cleared KES {amount} for tenant {target_tenant['name']}. Ledger in total reconciliation."))

            conn.commit()
            
            # Fetch structured updated data
            cursor.execute("SELECT * FROM mpesa_transactions WHERE id = ?", (tr_id,))
            transaction_res = dict(cursor.fetchone())

            conn.close()
            return {
                "transaction": transaction_res,
                "tenantMatched": target_tenant["name"],
                "invoiceSettlements": settlements_num
            }
        except Exception as e:
            conn.rollback()
            conn.close()
            raise e
