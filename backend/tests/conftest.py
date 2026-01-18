
import pytest
import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import TeamMember

@pytest.fixture
def app():
    # Use testing config
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret",
        "WTF_CSRF_ENABLED": False
    })

    with app.app_context():
        db.create_all()
        # Create default admin for tests
        admin = TeamMember(name="Admin", email="admin@test.com", username="admin", role="Admin")
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()
        
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_header(client):
    """
    Logs in the default admin and returns the Authorization header.
    """
    response = client.post('/api/auth/login', json={
        "email": "admin@test.com",
        "password": "admin123"
    })
    token = response.json['token']
    return {'Authorization': f'Bearer {token}'}
