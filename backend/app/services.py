
from datetime import datetime, timedelta
from sqlalchemy import func, extract, case
from flask import current_app
from app.extensions import db
from app.models import RecurringExpense, Expense, Tenant, Payment, MpesaTransaction, Billing, Property, Unit, Invoice, Message
import random
import string

def generate_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

class AlertService:
    @staticmethod
    def send_admin_alert(subject, body, severity='Info'):
        """
        Creates a Message record targeted at the 'Team' to serve as a system alert.
        Also logs to the application logger for external monitoring tools.
        """
        # Log to standard output for monitoring (e.g., Datadog, AWS CloudWatch)
        if severity.lower() in ['error', 'critical']:
            current_app.logger.error(f"[ALERT:{severity.upper()}] {subject} - {body}")
        else:
            current_app.logger.info(f"[ALERT:{severity.upper()}] {subject} - {body}")

        try:
            alert_msg = Message(
                recipient='System Admin',
                recipient_group='Team',
                type='System Alert', 
                property_name='System',
                unit_name='-',
                content=f"[{severity.upper()}] {subject}: {body}",
                status='Sent',
                date=datetime.now().strftime('%Y-%m-%d %H:%M')
            )
            db.session.add(alert_msg)
            db.session.commit()
        except Exception as e:
            current_app.logger.error(f"FAILED TO PERSIST ALERT TO DB: {e}")

class DashboardService:
    @staticmethod
    def get_stats():
        # Total Arrears (Sum of positive balances)
        arrears_stats = db.session.query(
            func.sum(Tenant.balance),
            func.count(Tenant.id)
        ).filter(Tenant.balance > 0).first()
        
        total_arrears = arrears_stats[0] or 0
        tenants_arrears_count = arrears_stats[1] or 0

        # Total Advance (Sum of negative balances, absolute value)
        advance_stats = db.session.query(
            func.sum(Tenant.balance),
            func.count(Tenant.id)
        ).filter(Tenant.balance < 0).first()
        
        total_advance = abs(advance_stats[0] or 0)
        tenants_advance_count = advance_stats[1] or 0

        # Unit Stats (Occupancy)
        unit_stats = db.session.query(
            func.count(Unit.id),
            func.sum(case((Unit.status == 'Occupied', 1), else_=0))
        ).first()
        
        total_units = unit_stats[0] or 0
        occupied_units = unit_stats[1] or 0
        
        occupancy_rate = 0
        if total_units > 0:
            occupancy_rate = round((occupied_units / total_units) * 100, 1)

        return {
            "totalArrears": float(total_arrears),
            "totalAdvance": float(total_advance),
            "tenantsArrearsCount": tenants_arrears_count,
            "tenantsAdvanceCount": tenants_advance_count,
            "occupancyRate": occupancy_rate,
            "totalUnits": total_units,
            "occupiedUnits": occupied_units
        }

class ReportService:
    @staticmethod
    def get_monthly_financials(year=None):
        """
        Aggregates financial data (Payments, Expenses, Invoices) by month for a given year.
        Uses string filtering for dates to ensure compatibility with SQLite and Postgres 
        where the date column is stored as VARCHAR ('YYYY-MM-DD').
        """
        if not year:
            year = datetime.now().year
            
        prefix = f"{year}-"
        
        # 1. Fetch data filtered by year prefix
        payments = db.session.query(Payment.date, Payment.amount)\
            .filter(Payment.date.startswith(prefix)).all()
            
        expenses = db.session.query(Expense.date, Expense.amount)\
            .filter(Expense.date.startswith(prefix)).all()
            
        invoices = db.session.query(Invoice.date, Invoice.total_amount)\
            .filter(Invoice.date.startswith(prefix)).all()

        # 2. Aggregate in Python to safely handle string dates across dialects
        monthly_data = {i: {"payments": 0.0, "expenses": 0.0, "invoices": 0.0} for i in range(1, 13)}

        for p in payments:
            try:
                month = int(p.date.split('-')[1])
                if 1 <= month <= 12:
                    monthly_data[month]["payments"] += p.amount
            except (IndexError, ValueError):
                continue

        for e in expenses:
            try:
                month = int(e.date.split('-')[1])
                if 1 <= month <= 12:
                    monthly_data[month]["expenses"] += e.amount
            except (IndexError, ValueError):
                continue

        for i in invoices:
            try:
                month = int(i.date.split('-')[1])
                if 1 <= month <= 12:
                    monthly_data[month]["invoices"] += i.total_amount
            except (IndexError, ValueError):
                continue

        # 3. Format response
        result = []
        months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        for i in range(1, 13):
            # Calculate rolling averages or last 6 months logic can be handled by client using this data
            # or we filter the result list here.
            # For now, returning full year data is standard for "Monthly Financials".
            result.append({
                "name": months_short[i-1],
                "monthIndex": i,
                "payments": monthly_data[i]["payments"],
                "expenses": monthly_data[i]["expenses"],
                "invoices": monthly_data[i]["invoices"]
            })
            
        return result

class RecurringService:
    @staticmethod
    def process_due_expenses():
        today = datetime.now().date()
        processed = []
        recurring = RecurringExpense.query.filter_by(status='Active').all()
        
        for rec in recurring:
            try:
                due_date = datetime.strptime(rec.next_due_date, '%Y-%m-%d').date()
            except:
                continue

            if due_date <= today:
                new_expense = Expense(
                    date=rec.next_due_date,
                    property_id=rec.property_id,
                    category=rec.category,
                    status='confirmed',
                    amount=rec.amount,
                    description=f"{rec.description} (Recurring - {rec.frequency})"
                )
                db.session.add(new_expense)
                processed.append(new_expense)

                next_due = due_date
                if rec.frequency == 'Monthly':
                    next_due = (due_date.replace(day=1) + timedelta(days=32)).replace(day=due_date.day)
                elif rec.frequency == 'Quarterly':
                    next_due = (due_date.replace(day=1) + timedelta(days=93)).replace(day=due_date.day)
                elif rec.frequency == 'Yearly':
                    next_due = due_date.replace(year=due_date.year + 1)
                
                rec.next_due_date = next_due.strftime('%Y-%m-%d')
        
        db.session.commit()
        return len(processed)

class MpesaService:
    @staticmethod
    def process_stk_push(amount, phone, account_ref):
        ref = "WS_" + generate_id()
        tx = MpesaTransaction(
            reference=ref,
            shortcode="247247",
            amount=amount,
            phone=phone,
            date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            status="Pending",
            description=f"STK Push for {account_ref}",
            tenant_name_snapshot="Unknown"
        )
        db.session.add(tx)
        db.session.commit()
        return ref

    @staticmethod
    def process_callback(phone, amount, ref_number, account_ref):
        tx = MpesaTransaction(
            reference=ref_number,
            shortcode="247247",
            amount=amount,
            phone=phone,
            date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            status="Completed",
            description="Payment Received",
            tenant_name_snapshot="Unknown"
        )
        
        clean_phone = phone.replace("+", "").replace(" ", "")
        
        matched_tenant = None
        tenants = Tenant.query.all()
        for t in tenants:
            t_phone = t.phone.replace("+", "").replace(" ", "") if t.phone else ""
            if clean_phone in t_phone or t_phone in clean_phone:
                matched_tenant = t
                break
        
        if not matched_tenant and account_ref:
            unit = Unit.query.filter(Unit.name.ilike(account_ref)).first()
            if unit:
                matched_tenant = Tenant.query.filter_by(unit_id=unit.id, status='Active').first()

        reconciled = False
        if matched_tenant:
            tx.tenant_name_snapshot = matched_tenant.name
            
            payment = Payment(
                payment_id=ref_number,
                date=datetime.now().strftime('%Y-%m-%d'),
                amount=amount,
                method="Mpesa",
                status="confirmed",
                tenant_id=matched_tenant.id,
                property_id=matched_tenant.property_id,
                unit_id=matched_tenant.unit_id
            )
            db.session.add(payment)
            
            matched_tenant.balance = (matched_tenant.balance or 0) - amount
            reconciled = True
        
        db.session.add(tx)
        db.session.commit()
        
        # Log system action
        from app.utils import log_system_action
        log_system_action('mpesa callback', f"Processed transaction {ref_number} for {amount}", username='System')
        
        return reconciled, tx
