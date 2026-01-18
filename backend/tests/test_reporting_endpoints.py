
import pytest
from datetime import datetime
from app.models import Payment, Expense, Invoice, Property, Unit, Tenant
from app.extensions import db

def test_monthly_financials_structure(client, auth_header, app):
    """
    Verifies that /api/reports/financials/monthly returns the data structure
    expected by RevenueChart.tsx (frontend).
    """
    with app.app_context():
        # Setup Data
        current_year = datetime.now().year
        # Add a payment in January
        p = Payment(date=f"{current_year}-01-15", amount=5000, status='confirmed')
        db.session.add(p)
        # Add an expense in January
        e = Expense(date=f"{current_year}-01-20", amount=1000, status='confirmed')
        db.session.add(e)
        
        db.session.commit()

    # Call API
    response = client.get('/api/reports/financials/monthly', headers=auth_header)
    assert response.status_code == 200
    
    data = response.json
    assert isinstance(data, list)
    assert len(data) == 12  # Should return all 12 months
    
    # Check January (Index 0 in list, monthIndex 1)
    jan = data[0]
    assert jan['name'] == 'Jan'
    assert jan['monthIndex'] == 1
    assert jan['payments'] == 5000
    assert jan['expenses'] == 1000
    
    # Check structure keys strictly
    expected_keys = {'name', 'monthIndex', 'payments', 'expenses', 'invoices'}
    assert set(jan.keys()) == expected_keys

def test_dashboard_stats_calculation(client, auth_header, app):
    """
    Verify dashboard stats logic matches business requirements.
    """
    with app.app_context():
        prop = Property(name="Stats Test", units_count=2)
        db.session.add(prop)
        db.session.commit()
        
        u1 = Unit(name="U1", property_id=prop.id, rent_amount=1000, status="Occupied")
        u2 = Unit(name="U2", property_id=prop.id, rent_amount=1000, status="Vacant")
        db.session.add_all([u1, u2])
        db.session.commit()
        
        # Tenant with Arrears
        t1 = Tenant(name="T1", property_id=prop.id, unit_id=u1.id, balance=1500)
        db.session.add(t1)
        db.session.commit()

    response = client.get('/api/dashboard/stats', headers=auth_header)
    stats = response.json
    
    assert stats['totalArrears'] == 1500
    assert stats['occupancyRate'] == 50.0  # 1 out of 2
    assert stats['occupiedUnits'] == 1
    assert stats['totalUnits'] == 2
