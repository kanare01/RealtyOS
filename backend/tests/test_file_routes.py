
import io
from app.models import Document

def test_upload_file(client, auth_header):
    """Test uploading a text file."""
    data = {
        'file': (io.BytesIO(b"test file content"), 'test.txt'),
        'category': 'general'
    }
    
    response = client.post(
        '/api/files/upload', 
        data=data,
        content_type='multipart/form-data',
        headers=auth_header
    )
    
    assert response.status_code == 201
    assert 'url' in response.json
    assert response.json['category'] == 'general'

def test_upload_invalid_category(client, auth_header):
    """Test uploading with an invalid category."""
    data = {
        'file': (io.BytesIO(b"content"), 'test.txt'),
        'category': 'hacker_stuff'
    }
    
    response = client.post(
        '/api/files/upload', 
        data=data,
        content_type='multipart/form-data',
        headers=auth_header
    )
    
    assert response.status_code == 400
    assert "Invalid category" in response.json['error']

def test_upload_no_file(client, auth_header):
    """Test request without file part."""
    response = client.post(
        '/api/files/upload', 
        data={'category': 'general'},
        content_type='multipart/form-data',
        headers=auth_header
    )
    assert response.status_code == 400
    assert "No file part" in response.json['error']
