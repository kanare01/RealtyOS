
from flask import jsonify, current_app
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response = e.get_response()
        response.data = jsonify({
            "code": e.code,
            "error": e.name,
            "message": e.description,
        }).data
        response.content_type = "application/json"
        return response

    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({
            "code": 413,
            "error": "Request Entity Too Large",
            "message": "The file you are trying to upload is too large. Maximum size is 16MB."
        }), 413

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(e):
        # Database integrity error (e.g. unique constraint violation)
        db_error = str(e.orig) if e.orig else str(e)
        app.logger.warning(f"Integrity Error: {db_error}")
        from app.extensions import db
        db.session.rollback()
        return jsonify({
            "code": 409,
            "error": "Conflict",
            "message": "The operation failed due to a database constraint (e.g., duplicate record)."
        }), 409

    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(e):
        # General Database Error (Connection issues, syntax, etc.)
        app.logger.error(f"Database Error: {str(e)}")
        from app.extensions import db
        db.session.rollback()
        return jsonify({
            "code": 500,
            "error": "Database Error", 
            "message": "A database error occurred. Please try again later."
        }), 500

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        # In production, log this error to a file or monitoring service like Sentry
        app.logger.error(f"Unhandled Exception: {str(e)}")
        message = "An unexpected error occurred. Please contact support."
        if app.debug:
            message = str(e)
            
        return jsonify({
            "code": 500,
            "error": "Internal Server Error",
            "message": message
        }), 500
