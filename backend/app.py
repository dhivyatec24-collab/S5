import os
import sys

# Allow `python app.py` from /backend and `python -m` from project root
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from database import init_db

from routes.auth import auth_bp
from routes.student import student_bp
from routes.cutoff import cutoff_bp
from routes.colleges import colleges_bp
from routes.recommendations import recommendations_bp
from routes.compare import compare_bp
from routes.chat import chat_bp
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

    # Initialize DB
    with app.app_context():
        init_db()

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(cutoff_bp)
    app.register_blueprint(colleges_bp)
    app.register_blueprint(recommendations_bp)
    app.register_blueprint(compare_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(admin_bp)

    # Static frontend hosting for production / standalone preview
    frontend_dist = os.path.join(os.path.dirname(Config.BASE_DIR), "frontend", "dist")

    def api_descriptor():
        return {
            "service": "Smart College Admission Counselor Agent API",
            "status": "operational",
            "target": "Tamil Nadu Engineering Admissions (TNEA)",
            "frontend_status": "built" if os.path.exists(os.path.join(frontend_dist, "index.html")) else "Run 'npm run dev' inside /frontend or 'npm run build'",
            "endpoints": {
                "health": "/api/health",
                "auth": "/api/auth/register | /api/auth/login",
                "cutoff": "/api/cutoff/calculate | /api/cutoff/predict | /api/cutoff/ml-metrics",
                "colleges": "/api/colleges",
                "recommendations": "/api/recommendations",
                "compare": "/api/compare",
                "chat": "/api/chat",
                "admin": "/api/admin/status"
            }
        }

    @app.route("/api", methods=["GET"])
    @app.route("/api/", methods=["GET"])
    def api_root():
        return jsonify(api_descriptor())

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Smart College Admission Counselor Agent API",
            "version": "1.0.0",
            "target": "Tamil Nadu Engineering Admissions (TNEA)"
        })

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path == "api" or path.startswith("api/"):
            if path in ("api", "api/"):
                return jsonify(api_descriptor())
            return jsonify({"error": "API route not found"}), 404
        if os.path.exists(frontend_dist):
            target_file = os.path.join(frontend_dist, path)
            if path and os.path.exists(target_file):
                return send_from_directory(frontend_dist, path)
            return send_from_directory(frontend_dist, "index.html")
        return jsonify(api_descriptor())

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print(f"\n========================================================")
    print(f" SMART COLLEGE ADMISSION COUNSELOR AGENT (TNEA) BACKEND")
    print(f" Running on http://127.0.0.1:{port}")
    print(f"========================================================\n")
    app.run(host="127.0.0.1", port=port, debug=True)
