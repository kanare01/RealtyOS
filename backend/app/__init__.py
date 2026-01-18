
import os
import time
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, send_from_directory, request, g, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from config import Config
from app.extensions import db, ma, cors, migrate, limiter
from app.errors import register_error_handlers
from flask_jwt_extended import JWTManager
from flask_apscheduler import APScheduler
from flask_compress import Compress

# Initialize Scheduler instance
scheduler = APScheduler()
compress = Compress()

def create_app(config_class=Config):
    # Set static_folder to point to the frontend build directory if it exists
    app = Flask(__name__, static_folder='../static/dist', static_url_path='/')
    app.config.from_object(config_class)

    # Apply ProxyFix middleware
    # This is required when running behind a reverse proxy (Nginx, AWS ALB, etc.)
    # to correctly resolve request.remote_addr and generate correct URLs.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    # JWT Config
    app.config['JWT_SECRET_KEY'] = app.config.get('JWT_SECRET_KEY')

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    
    # CORS: Restrict in production via env var if needed, default to * for this template
    # Split by comma and strip whitespace to handle "http://a.com, http://b.com" gracefully
    cors_origins_raw = os.environ.get('CORS_ORIGINS', '*')
    cors_origins = [s.strip() for s in cors_origins_raw.split(',')] if cors_origins_raw != '*' else '*'
    
    cors.init_app(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)
    
    migrate.init_app(app, db)
    limiter.init_app(app)
    jwt = JWTManager(app)
    compress.init_app(app)

    # --- JWT Error Handlers ---
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({
            "error": "Unauthorized", 
            "description": "Missing Authorization Header",
            "msg": "Missing Authorization Header"
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return jsonify({
            "error": "Invalid Token", 
            "description": "Your session token is invalid. Please login again.",
            "msg": "Invalid Token"
        }), 401

    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return jsonify({
            "error": "Token Expired", 
            "description": "Your session has expired. Please login again.",
            "msg": "Token Expired"
        }), 401
    
    # Initialize Scheduler
    scheduler.init_app(app)
    
    # Register Jobs
    from app.tasks import process_recurring_expenses, generate_monthly_rent, check_reminders
    
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        try:
            scheduler.add_job(id='daily_expenses', func=process_recurring_expenses, trigger='cron', hour=0, minute=1)
            scheduler.add_job(id='monthly_rent', func=generate_monthly_rent, trigger='cron', day=1, hour=6)
            scheduler.add_job(id='daily_reminders', func=check_reminders, trigger='cron', hour=9, minute=0)
            scheduler.start()
        except Exception as e:
            app.logger.warning(f"Scheduler failed to start: {e}")

    # Register Error Handlers
    register_error_handlers(app)

    # Register Blueprints
    from app.routes.main_routes import main_bp
    from app.routes.finance_routes import finance_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.file_routes import file_bp
    from app.routes.report_routes import report_bp
    
    app.register_blueprint(main_bp, url_prefix='/api')
    app.register_blueprint(finance_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(file_bp, url_prefix='/api/files')
    app.register_blueprint(report_bp, url_prefix='/api/reports')

    # --- Monitoring Middleware ---
    @app.before_request
    def start_timer():
        g.start = time.time()

    @app.after_request
    def log_request(response):
        if request.path.startswith('/static') or request.path == '/favicon.ico':
            return response
            
        now = time.time()
        duration = round(now - g.start, 2)
        ip = request.remote_addr
        # host = request.host.split(':', 1)[0]
        
        # Structure log for easier parsing
        log_data = f"method={request.method} path={request.path} status={response.status_code} duration={duration} ip={ip}"
        
        if response.status_code >= 500:
            app.logger.error(log_data)
        elif response.status_code >= 400:
            app.logger.warning(log_data)
        else:
            app.logger.info(log_data)

        return response

    # Security Headers Middleware
    @app.after_request
    def add_security_headers(response):
        # HSTS (Force HTTPS) - 1 year
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        # Basic CSP
        response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:* https://*;"
        return response

    # Serve React App (SPA Support)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            if os.path.exists(app.static_folder + '/index.html'):
                return send_from_directory(app.static_folder, 'index.html')
            return jsonify({"message": "Backend API is running. Frontend static files not found."}), 200

    # Configure Logging
    if not app.debug and not app.testing:
        log_level = logging.INFO
        if app.config['LOG_LEVEL'] == 'DEBUG': log_level = logging.DEBUG
        elif app.config['LOG_LEVEL'] == 'WARNING': log_level = logging.WARNING
        elif app.config['LOG_LEVEL'] == 'ERROR': log_level = logging.ERROR

        if app.config['LOG_TO_STDOUT']:
            stream_handler = logging.StreamHandler()
            stream_handler.setLevel(log_level)
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            stream_handler.setFormatter(formatter)
            app.logger.addHandler(stream_handler)
        else:
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler('logs/realtyos.log', maxBytes=10240, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
            file_handler.setLevel(log_level)
            app.logger.addHandler(file_handler)

        app.logger.setLevel(log_level)
        app.logger.info('RealtyOS startup')

    # Seed Data (Run only if needed)
    with app.app_context():
        # Avoid running heavy DB ops on every request worker boot
        pass

    return app
