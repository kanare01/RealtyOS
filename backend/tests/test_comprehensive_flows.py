
import pytest
from datetime import datetime, timedelta
from app.models import MaintenanceRequest, Expense, RecurringExpense, Property, Unit, Payment, Invoice
from app.extensions import db
from app.services import RecurringService, ReportService

def test_maintenance_lifecycle(client, auth_header, app):
    """
    Test creating, updating, and closing a maintenance request.
    """
    # 1. Setup Property
    client.post('/api/properties', json={"name": "MaintProp", "units": 1}, headers=auth_header)
    
    # 2. Create Request
    req_data = {
        "title": "Broken Pipe",
        "propertyName": "MaintProp",
        "priority": "High",
        "status": "Open",
        "category": "Plumbing",
        "date": "2023-12-01"
    }
    res = client.post('/api/maintenance', json=req_data, headers=auth_header)
    assert res.status_code == 201
    req_id = res.json['id']
    
    # 3. Update Status
    res = client.put(f'/api/maintenance/{req_id}', json={"status": "In Progress"}, headers=auth_header)
    assert res.status_code == 200
    assert res.json['status'] == "In Progress"
    
    # 4. Close and Add Cost
    res = client.put(f'/api/maintenance/{req_id}', json={"status": "Closed", "cost": 1500}, headers=auth_header)
    assert res.status_code == 200
    
    # 5. Verify DB state
    with app.app_context():
        req = MaintenanceRequest.query.get(req_id)
        assert req.status == "Closed"
        assert req.cost == 1500

def test_recurring_expense_processing(client, auth_header, app):
    """
    Test that the scheduler logic correctly generates expenses from recurring definitions.
    """
    with app.app_context():
        # Setup Property
        p = Property(name="RecProp", units_count=1)
        db.session.add(p)
        db.session.commit()
        
        # Create Recurring Expense due today
        today = datetime.now().strftime('%Y-%m-%d')
        rec = RecurringExpense(
            description="Security Fee",
            amount=5000,
            frequency="Monthly",
            next_due_date=today,
            property_id=p.id,
            status="Active",
            category="Security"
        )
        db.session.add(rec)
        db.session.commit()
        rec_id = rec.id

        # Trigger Service Manually
        processed_count = RecurringService.process_due_expenses()
        assert processed_count == 1
        
        # Verify Expense Record Created
        exp = Expense.query.filter_by(description="Security Fee (Recurring - Monthly)").first()
        assert exp is not None
        assert exp.amount == 5000
        assert exp.date == today
        
        # Verify Next Due Date Advanced
        updated_rec = RecurringExpense.query.get(rec_id)
        assert updated_rec.next_due_date > today

def test_reporting_dashboard_data(client, auth_header, app):
    """
    Test that the dashboard stats endpoint returns correct aggregations.
    """
    with app.app_context():
        # Create data points
        # 1. Invoice (Unpaid) -> Should show as Arrears (if connected to Tenant) or just Billed in charts
        # 2. Tenant with positive balance (Arrears)
        # 3. Tenant with negative balance (Advance)
        
        prop = Property(name="StatsProp", units_count=2)
        db.session.add(prop)
        db.session.commit()
        
        u1 = Unit(name="U1", property_id=prop.id, rent_amount=1000, status="Occupied")
        u2 = Unit(name="U2", property_id=prop.id, rent_amount=1000, status="Vacant")
        db.session.add_all([u1, u2])
        db.session.commit()
        
        # Tenant 1: Arrears
        from app.models import Tenant
        t1 = Tenant(name="Debtor", property_id=prop.id, unit_id=u1.id, balance=5000)
        # Tenant 2: Advance
        t2 = Tenant(name="Creditor", property_id=prop.id, unit_id=u2.id, balance=-2000)
        db.session.add_all([t1, t2])
        db.session.commit()
        
    # Call Stats API
    res = client.get('/api/dashboard/stats', headers=auth_header)
    assert res.status_code == 200
    stats = res.json
    
    assert stats['totalArrears'] == 5000
    assert stats['totalAdvance'] == 2000
    assert stats['tenantsArrearsCount'] == 1
    assert stats['tenantsAdvanceCount'] == 1
    # Occupancy: 1 occupied / 2 total = 50%
    assert stats['occupancyRate'] == 50.0
