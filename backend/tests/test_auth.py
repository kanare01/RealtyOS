
def test_login_success(client):
    response = client.post('/api/auth/login', json={
        "email": "admin@test.com",
        "password": "admin123"
    })
    assert response.status_code == 200
    assert 'token' in response.json
    assert response.json['user']['email'] == "admin@test.com"

def test_login_failure(client):
    response = client.post('/api/auth/login', json={
        "email": "admin@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert 'error' in response.json

def test_protected_route_access(client, auth_header):
    # Access without token
    response = client.get('/api/auth/me')
    assert response.status_code == 401 # Unauthorized (Flask-JWT-Extended default)

    # Access with token
    response = client.get('/api/auth/me', headers=auth_header)
    assert response.status_code == 200
    assert response.json['email'] == "admin@test.com"
