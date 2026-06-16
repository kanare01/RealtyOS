from backend.extensions import db

class BaseModel:
    """Base class for ORM-equivalent models operating on SQLite."""
    table_name = None

    @classmethod
    def get_all(cls):
        return db.fetch_all(f"SELECT * FROM {cls.table_name}")

    @classmethod
    def get_by_id(cls, entity_id):
        return db.fetch_one(f"SELECT * FROM {cls.table_name} WHERE id = ?", (entity_id,))

    @classmethod
    def count(cls):
        res = db.fetch_one(f"SELECT COUNT(*) as cnt FROM {cls.table_name}")
        return res['cnt'] if res else 0

    @classmethod
    def delete_by_id(cls, entity_id):
        db.execute_and_commit(f"DELETE FROM {cls.table_name} WHERE id = ?", (entity_id,))
        return True
