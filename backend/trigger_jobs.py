
from app import create_app
from app.tasks import process_recurring_expenses, generate_monthly_rent, check_reminders

app = create_app()

def trigger_all():
    print("🚀 Manually Triggering Scheduler Jobs...")
    
    with app.app_context():
        print("\n1. Processing Recurring Expenses...")
        process_recurring_expenses()
        
        print("\n2. Checking Reminders (Lease Expiry/Overdue)...")
        check_reminders()
        
        print("\n3. Generating Monthly Rent (Force Run)...")
        # Note: This might duplicate invoices if run on the same day as the automatic scheduler
        # without strict idempotency checks in the task logic.
        # The current task logic has a check `if not existing_invoice`, so it is safe.
        generate_monthly_rent()
        
    print("\n✅ All jobs triggered.")

if __name__ == "__main__":
    trigger_all()
