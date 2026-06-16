from backend.models import BaseModel
from backend.extensions import db

class User(BaseModel):
    table_name = "users"

    @classmethod
    def get_by_email(cls, email):
        return db.fetch_one("SELECT * FROM users WHERE LOWER(email) = ?", (email.lower().strip(),))

    @classmethod
    def create(cls, name, email, password, role="User", username=None):
        query = """
        INSERT INTO users (name, email, password, role, username, isActive, failedAttempts, lockedUntil)
        VALUES (?, ?, ?, ?, ?, 1, 0, 0)
        """
        user_id = db.execute_and_commit(query, (name, email.lower().strip(), password, role, username or email.split('@')[0]))
        return cls.get_by_id(user_id)
