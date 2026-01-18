
from datetime import datetime, timedelta
from app.services import RecurringService, ReportService, MpesaService
from app.models import RecurringExpense, Expense, Tenant, Payment, Unit, Property, Invoice
from app.extensions import db

def test_process_due_expenses(client, app):
    """
    Test that due recurring expenses generate actual expenses and update next_due_date.
    """
    with app.app_context():
        # Setup Property
        prop = Property(name="SvcProp", units_count=1)
        db.session.add(prop)
        db.session.commit()

        # Setup Due Recurring Expense (due today)
        today = datetime.now().strftime('%Y-%m-%d')
        rec = RecurringExpense(
            description="Monthly Clean",
            amount=500,
            frequency="Monthly",
            next_due_date=today,
            property_id=prop.id,
            status='Active',
            category='Maintenance'
        )
        db.session.add(rec)
        db.session.commit()

        # Run Service
        count = RecurringService.process_due_expenses()
        assert count == 1

        # Verify Expense Created
        exp = Expense.query.first()
        assert exp is not None
        assert exp.amount == 500
        assert exp.property_id == prop.id
        assert exp.date == today

        # Verify Next Due Date Updated (approx 1 month later)
        updated_rec = RecurringExpense.query.get(rec.id)
        assert updated_rec.next_due_date > today

def test_report_service_financials(client, app):
    """
    Test report aggregation logic.
    """
    with app.app_context():
        # Setup Data
        current_year = datetime.now().year
        date_str = f"{current_year}-05-15" # May 15th

        # Add Payment
        p = Payment(date=date_str, amount=1000, status='confirmed')
        db.session.add(p)
        
        # Add Expense
        e = Expense(date=date_str, amount=200, status='confirmed')
        db.session.add(e)

        # Add Invoice
        i = Invoice(date=date_str, total_amount=1500, status='Unpaid')
        db.session.add(i)
        
        db.session.commit()

        # Run Service
        report = ReportService.get_monthly_financials(current_year)
        
        # Verify May (Index 5)
        may_data = next(item for item in report if item['monthIndex'] == 5)
        assert may_data['payments'] == 1000
        assert may_data['expenses'] == 200
        assert may_data['invoices'] == 1500

def test_mpesa_callback_logic(client, app):
    """
    Test MPESA callback reconciling payment to tenant.
    """
    with app.app_context():
        # Setup Tenant
        prop = Property(name="MpesaProp")
        db.session.add(prop)
        db.session.commit()
        
        unit = Unit(name="U1", property_id=prop.id, rent_amount=5000)
        db.session.add(unit)
        db.session.commit()

        tenant = Tenant(
            name="Mpesa User",
            phone="254712345678",
            property_id=prop.id,
            unit_id=unit.id,
            balance=5000
        )
        db.session.add(tenant)
        db.session.commit()

        # Simulate Callback
        reconciled, tx = MpesaService.process_callback(
            phone="254712345678",
            amount=5000,
            ref_number="Q123456",
            account_ref="U1"
        )

        assert reconciled is True
        assert tx.status == "Completed"
        
        # Verify Balance Updated
        t = Tenant.query.get(tenant.id)
        assert t.balance == 0
        
        # Verify Payment Record Created
        pay = Payment.query.filter_by(payment_id="Q123456").first()
        assert pay is not None
        assert pay.amount == 5000
