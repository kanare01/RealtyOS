import sqlite3
import os
import json
import re

class Database:
    def __init__(self, db_file="realtyos.db"):
        self.db_file = db_file

    def get_connection(self):
        conn = sqlite3.connect(self.db_file)
        conn.row_factory = sqlite3.Row
        return conn

    def execute(self, query, params=(), commit=False):
        """Execute a query and optionally commit. Returns the cursor."""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            if commit:
                conn.commit()
            return cursor
        except Exception as e:
            if commit:
                conn.rollback()
            raise e
        finally:
            # We don't close connection here because cursor needs it if fetching,
            # but standard sqlite3 row fetching requires connection to remain open,
            # so we'll close inside query-fetch functions instead.
            pass

    def execute_and_commit(self, query, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            conn.commit()
            lastrowid = cursor.lastrowid
            conn.close()
            return lastrowid
        except Exception as e:
            conn.rollback()
            conn.close()
            raise e

    def execute_many(self, query, param_list=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.executemany(query, param_list)
            conn.commit()
            conn.close()
        except Exception as e:
            conn.rollback()
            conn.close()
            raise e

    def fetch_all(self, query, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            rows = cursor.fetchall()
            result = [self.row_to_dict(r) for r in rows]
            conn.close()
            return result
        except Exception as e:
            conn.close()
            raise e

    def fetch_one(self, query, params=()):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            row = cursor.fetchone()
            result = self.row_to_dict(row)
            conn.close()
            return result
        except Exception as e:
            conn.close()
            raise e

    def row_to_dict(self, row):
        if not row:
            return None
        d = dict(row)
        for key, value in d.items():
            if isinstance(value, str):
                if (value.startswith("[") and value.endswith("]")) or (value.startswith("{") and value.endswith("}")):
                    try:
                        d[key] = json.loads(value)
                    except ValueError:
                        pass
        return d

# Global DB instance
db = Database()

def sanitize_text(val):
    if not isinstance(val, str):
        return ""
    return re.sub(r'<[^>]*>', '', val).strip()
