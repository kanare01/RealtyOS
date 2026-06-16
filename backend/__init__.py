import os
from flask import Flask, jsonify
from backend.config import Config
from backend.database_initializer import init_db

# Import blueprint structures
from backend.routes.auth import auth_bp
from backend.routes.properties import properties_bp
from backend.routes.units import units_bp
from backend.routes.tenants import tenants_bp
from backend.routes.leases import leases_bp
from backend.routes.financial import financial_bp
from backend.routes.operations import operations_bp
from backend.routes.settings import settings_bp
from backend.routes.dashboard import dashboard_bp

def create_app(config_class=Config):
    app = Flask(__name__, static_folder=config_class.STATIC_FOLDER, static_url_path="")
    app.config.from_object(config_class)

    # Initialize tables and initial seed values
    init_db()

    # CORS configuration
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    @app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
    @app.route('/<path:path>', methods=['OPTIONS'])
    def options_handler(path):
        return '', 200

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(properties_bp)
    app.register_blueprint(units_bp)
    app.register_blueprint(tenants_bp)
    app.register_blueprint(leases_bp)
    app.register_blueprint(financial_bp)
    app.register_blueprint(operations_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(dashboard_bp)

    # UI Single-Page Application redirection
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def catch_all(path):
        if path.startswith("api/"):
            return jsonify({"error": "Not Found"}), 404
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        return app.send_static_file("index.html")

    return app
