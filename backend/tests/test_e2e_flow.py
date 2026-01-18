
def test_full_user_journey(client, auth_header):
    """
    Simulates:
    1. Admin creates a Property
    2. Admin creates a Unit
    3. Admin adds a Tenant
    4. Admin creates an Invoice
    5. Tenant pays (via Payment record)
    6. System verifies 0 balance
    """
    
    # 1. Create Property
    prop_res = client.post('/api/properties', json={
        "name": "E2E Heights",
        "address": "100 Test Lane",
        "units": 5,
        "type": "Residential"
    }, headers=auth_header)
    assert prop_res.status_code == 201
    prop_id = prop_res.json['id']

    # 2. Create Unit
    unit_res = client.post('/api/units', json={
        "name": "E1",
        "propertyId": prop_id,
        "rentAmount": 25000,
        "category": "2 Bedroom"
    }, headers=auth_header)
    assert unit_res.status_code == 201
    unit_id = unit_res.json['id']

    # 3. Create Tenant
    tenant_res = client.post('/api/tenants', json={
        "name": "End User",
        "firstName": "End",
        "lastName": "User",
        "phone": "+254799999999",
        "email": "e2e@test.com",
        "propertyId": prop_id,
        "unit": "E1"
    }, headers=auth_header)
    assert tenant_res.status_code == 201
    tenant_id = tenant_res.json['id']

    # Verify initial balance is 0
    t_check = client.get('/api/tenants', headers=auth_header)
    tenant_data = next(t for t in t_check.json if t['id'] == tenant_id)
    assert tenant_data['balance'] == 0

    # 4. Create Invoice
    inv_res = client.post('/api/invoices', json={
        "tenantName": "End User",
        "invoiceNumber": "INV-E2E-001",
        "date": "2023-11-01",
        "dueDate": "2023-11-05",
        "totalAmount": 25000,
        "items": [{"description": "Nov Rent", "amount": 25000}]
    }, headers=auth_header)
    assert inv_res.status_code == 201

    # Verify balance increased
    t_check_2 = client.get('/api/tenants', headers=auth_header)
    tenant_data_2 = next(t for t in t_check_2.json if t['id'] == tenant_id)
    assert tenant_data_2['balance'] == 25000

    # 5. Record Payment
    pay_res = client.post('/api/payments', json={
        "tenantName": "End User",
        "propertyName": "E2E Heights",
        "unitName": "E1",
        "amount": 25000,
        "method": "Cash",
        "date": "2023-11-02",
        "paymentId": "PAY-E2E-001"
    }, headers=auth_header)
    assert pay_res.status_code == 201

    # 6. Verify Final Balance
    t_check_3 = client.get('/api/tenants', headers=auth_header)
    tenant_data_3 = next(t for t in t_check_3.json if t['id'] == tenant_id)
    assert tenant_data_3['balance'] == 0
