
import pytest
from app.models import TeamMember
from app.extensions import db

@pytest.fixture
def agent_auth_header(client, app):
    """Creates an 'Agent' user and returns their auth header."""
    with app.app_context():
        agent = TeamMember(name="Agent 007", email="agent@test.com", username="agent", role="Agent")
        agent.set_password("agent123")
        db.session.add(agent)
        db.session.commit()
    
    response = client.post('/api/auth/login', json={
        "email": "agent@test.com",
        "password": "agent123"
    })
    token = response.json['token']
    return {'Authorization': f'Bearer {token}'}

def test_admin_only_routes(client, agent_auth_header):
    """Test that an Agent cannot access Admin-only routes."""
    # Try to update system settings
    res = client.post('/api/settings', json={"companyName": "Hacked"}, headers=agent_auth_header)
    assert res.status_code == 403
    assert "Insufficient permissions" in res.json['msg']

    # Try to view audit logs
    res = client.get('/api/audit-logs', headers=agent_auth_header)
    assert res.status_code == 403

def test_manager_routes(client, agent_auth_header):
    """Test that an Agent cannot access Manager routes."""
    # Try to create a property
    res = client.post('/api/properties', json={
        "name": "Unauthorized Prop",
        "units": 1
    }, headers=agent_auth_header)
    assert res.status_code == 403

def test_public_callback(client):
    """Test that MPESA callback is public (no auth required)."""
    res = client.post('/api/mpesa/simulate-callback', json={
        "phone": "254700000000",
        "amount": 100,
        "reference": "REF123"
    })
    assert res.status_code == 200
