
def test_financial_flow(client, auth_header):
    # Setup: Create Property, Unit, Tenant
    client.post('/api/properties', json={"name": "FinTower", "units": 2}, headers=auth_header)
    client.post('/api/units', json={"name": "F1", "propertyName": "FinTower", "rentAmount": 20000}, headers=auth_header)
    client.post('/api/tenants', json={
        "name": "Bob Builder", 
        "property": "FinTower", 
        "unit": "F1", 
        "phone": "0700000000"
    }, headers=auth_header)

    # 1. Create Invoice
    invoice_data = {
        "tenantName": "Bob Builder",
        "property": "FinTower",
        "unit": "F1",
        "invoiceNumber": "INV-001",
        "date": "2023-11-01",
        "dueDate": "2023-11-05",
        "totalAmount": 20000,
        "items": [{"description": "November Rent", "amount": 20000}]
    }
    res = client.post('/api/invoices', json=invoice_data, headers=auth_header)
    assert res.status_code == 201
    
    # Check Tenant Balance (Should be 20000)
    res = client.get('/api/tenants', headers=auth_header)
    tenant = next(t for t in res.json if t['name'] == "Bob Builder")
    assert tenant['balance'] == 20000

    # 2. Record Payment
    payment_data = {
        "tenantName": "Bob Builder",
        "propertyName": "FinTower",
        "unitName": "F1",
        "amount": 20000,
        "method": "Mpesa",
        "date": "2023-11-02",
        "paymentId": "QX12345"
    }
    res = client.post('/api/payments', json=payment_data, headers=auth_header)
    assert res.status_code == 201

    # Check Tenant Balance (Should be 0)
    res = client.get('/api/tenants', headers=auth_header)
    tenant = next(t for t in res.json if t['name'] == "Bob Builder")
    assert tenant['balance'] == 0
