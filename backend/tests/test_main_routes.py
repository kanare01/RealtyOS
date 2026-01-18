
def test_property_lifecycle(client, auth_header):
    # 1. Create Property
    prop_data = {
        "name": "Sunset Heights",
        "address": "123 Sunset Blvd",
        "units": 10,
        "type": "Residential"
    }
    res = client.post('/api/properties', json=prop_data, headers=auth_header)
    assert res.status_code == 201
    assert res.json['name'] == "Sunset Heights"
    prop_id = res.json['id']

    # 2. Get Properties
    res = client.get('/api/properties', headers=auth_header)
    assert res.status_code == 200
    assert len(res.json) == 1
    assert res.json[0]['name'] == "Sunset Heights"

    # 3. Delete Property
    res = client.delete(f'/api/properties/{prop_id}', headers=auth_header)
    assert res.status_code == 200
    
    # Verify deletion
    res = client.get('/api/properties', headers=auth_header)
    assert len(res.json) == 0

def test_unit_and_tenant_flow(client, auth_header):
    # Setup Property
    client.post('/api/properties', json={"name": "Complex A", "units": 5}, headers=auth_header)
    
    # 1. Create Unit
    unit_data = {
        "name": "A101",
        "propertyName": "Complex A",
        "rentAmount": 15000,
        "category": "2 Bedroom"
    }
    res = client.post('/api/units', json=unit_data, headers=auth_header)
    assert res.status_code == 201
    assert res.json['status'] == 'Vacant'
    
    # 2. Create Tenant (Assign to Unit)
    tenant_data = {
        "name": "Alice Smith",
        "firstName": "Alice",
        "lastName": "Smith",
        "phone": "+254711223344",
        "property": "Complex A",
        "unit": "A101"
    }
    res = client.post('/api/tenants', json=tenant_data, headers=auth_header)
    assert res.status_code == 201
    
    # 3. Verify Unit Status is now Occupied
    res = client.get('/api/units', headers=auth_header)
    unit = res.json[0]
    assert unit['name'] == "A101"
    assert unit['status'] == "Occupied"
