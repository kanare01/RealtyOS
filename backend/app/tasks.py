
from flask import current_app
from app.extensions import db
from app.models import Tenant, Invoice, InvoiceItem, Unit, Message
from app.services import RecurringService, AlertService
from datetime import datetime, timedelta

def process_recurring_expenses():
    """
    Task to check and generate recurring expenses.
    Scheduled to run daily.
    """
    try:
        # Ensure we have an active context (handled by Scheduler or Request)
        if not current_app:
            print("Error: No application context found for task.")
            return

        print(f"[{datetime.now()}] SCHEDULER: Processing Recurring Expenses...")
        count = RecurringService.process_due_expenses()
        if count > 0:
            print(f"[{datetime.now()}] SCHEDULER: Created {count} new expense records.")
            current_app.logger.info(f"SCHEDULER: Created {count} new expense records.")
    except Exception as e:
        error_msg = f"Failed to process recurring expenses: {str(e)}"
        print(f"[{datetime.now()}] SCHEDULER ERROR: {error_msg}")
        current_app.logger.error(error_msg)
        AlertService.send_admin_alert("Task Failed: Recurring Expenses", error_msg, severity="Error")

def generate_monthly_rent():
    """
    Task to generate rent invoices for all active tenants.
    Scheduled to run monthly (e.g., on the 1st).
    """
    try:
        print(f"[{datetime.now()}] SCHEDULER: Generating Monthly Rent Invoices...")
        
        today = datetime.now()
        month_str = today.strftime("%B %Y") # e.g. "October 2023"
        due_date = (today + timedelta(days=5)).strftime("%Y-%m-%d") # Default due date: 5th
        
        count = 0
        active_tenants = Tenant.query.filter_by(status='Active').all()
        
        for tenant in active_tenants:
            # Check if invoice for this month's rent already exists
            description_match = f"Rent - {month_str}"
            
            existing_invoice = Invoice.query.join(InvoiceItem).filter(
                Invoice.tenant_id == tenant.id,
                InvoiceItem.description == description_match
            ).first()
            
            if not existing_invoice:
                # Find unit to get rent amount
                unit = Unit.query.get(tenant.unit_id)
                if unit and unit.rent_amount > 0:
                    new_invoice = Invoice(
                        date=today.strftime("%Y-%m-%d"),
                        due_date=due_date,
                        invoice_number=f"INV-{today.strftime('%Y%m')}-{tenant.id}",
                        tenant_id=tenant.id,
                        property_id=tenant.property_id,
                        unit_id=tenant.unit_id,
                        total_amount=unit.rent_amount,
                        status='Unpaid'
                    )
                    
                    # Add Invoice Item
                    item = InvoiceItem(
                        description=description_match, 
                        amount=unit.rent_amount
                    )
                    new_invoice.items.append(item)
                    
                    # Update Balance
                    tenant.balance = (tenant.balance or 0) + unit.rent_amount
                    
                    db.session.add(new_invoice)
                    count += 1
        
        if count > 0:
            db.session.commit()
            msg = f"SCHEDULER: Generated {count} rent invoices."
            print(f"[{datetime.now()}] {msg}")
            current_app.logger.info(msg)
        else:
            print(f"[{datetime.now()}] SCHEDULER: No new rent invoices generated.")
            
    except Exception as e:
        error_msg = f"Failed to generate monthly rent: {str(e)}"
        print(f"[{datetime.now()}] SCHEDULER ERROR: {error_msg}")
        current_app.logger.error(error_msg)
        AlertService.send_admin_alert("Task Failed: Monthly Rent", error_msg, severity="Critical")

def check_reminders():
    """
    Task to check for expiring leases and overdue invoices.
    Scheduled to run daily.
    """
    try:
        print(f"[{datetime.now()}] SCHEDULER: Checking Reminders...")
        today = datetime.now().date()
        
        # 1. Lease Expiry Reminders (30 days out)
        expiry_threshold = today + timedelta(days=30)
        expiring_tenants = Tenant.query.filter_by(status='Active').filter(
            Tenant.lease_end_date == expiry_threshold.strftime('%Y-%m-%d')
        ).all()
        
        for t in expiring_tenants:
            msg = Message(
                recipient=t.name,
                recipient_group='Tenant',
                type='System Alert',
                property_name=t.property_obj.name if t.property_obj else '-',
                unit_name=t.unit_obj.name if t.unit_obj else '-',
                content=f"Lease expiring on {t.lease_end_date}. Please contact management to renew.",
                status='Pending',
                date=datetime.now().strftime('%Y-%m-%d %H:%M')
            )
            db.session.add(msg)
        
        # 2. Overdue Invoices (Due yesterday and Unpaid)
        yesterday = today - timedelta(days=1)
        overdue_invoices = Invoice.query.filter_by(status='Unpaid').filter(
            Invoice.due_date == yesterday.strftime('%Y-%m-%d')
        ).all()
        
        for inv in overdue_invoices:
            inv.status = 'Overdue'
            tenant = Tenant.query.get(inv.tenant_id)
            if tenant:
                msg = Message(
                    recipient=tenant.name,
                    recipient_group='Tenant',
                    type='System Alert',
                    property_name=tenant.property_obj.name if tenant.property_obj else '-',
                    unit_name=tenant.unit_obj.name if tenant.unit_obj else '-',
                    content=f"Invoice {inv.invoice_number} of {inv.total_amount} was due on {inv.due_date}. Please make payment.",
                    status='Pending',
                    date=datetime.now().strftime('%Y-%m-%d %H:%M')
                )
                db.session.add(msg)

        db.session.commit()
        print(f"[{datetime.now()}] SCHEDULER: Reminders checked. {len(expiring_tenants)} leases expiring, {len(overdue_invoices)} overdue.")

    except Exception as e:
        print(f"[{datetime.now()}] SCHEDULER ERROR in Reminders: {str(e)}")
        current_app.logger.error(f"SCHEDULER ERROR in Reminders: {str(e)}")
