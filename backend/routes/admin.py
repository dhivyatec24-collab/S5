import os
import sys
from flask import Blueprint, request, jsonify
from database import get_db_connection
from config import Config

# Ensure ml package is accessible
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(backend_dir)
sys.path.append(os.path.join(root_dir, "ml"))

from training.train import train_model
from prediction.predict import load_metrics

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/status", methods=["GET"])
def system_status():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM colleges")
    colleges_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM users")
    users_count = cursor.fetchone()[0]
    conn.close()

    model_exists = os.path.exists(Config.ML_MODEL_PATH)
    metrics = load_metrics() if model_exists else None

    return jsonify({
        "status": "operational",
        "verified_colleges_count": colleges_count,
        "registered_students_count": users_count,
        "ml_model_loaded": model_exists,
        "ml_model_metrics": metrics
    })

@admin_bp.route("/retrain", methods=["POST"])
def retrain():
    try:
        metrics = train_model()
        return jsonify({
            "message": "Random Forest model successfully retrained on authentic TNEA data!",
            "metrics": metrics
        })
    except Exception as e:
        return jsonify({"error": f"Retraining failed: {str(e)}"}), 500
