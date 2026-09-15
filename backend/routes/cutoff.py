import os
import sys
from flask import Blueprint, request, jsonify
from services.cutoff_service import calculate_tnea_cutoff

# Ensure ML package is accessible
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(backend_dir)
sys.path.append(os.path.join(root_dir, "ml"))

from prediction.predict import predict_single, load_metrics

cutoff_bp = Blueprint("cutoff", __name__, url_prefix="/api/cutoff")

@cutoff_bp.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json() or {}
    maths = data.get("maths")
    physics = data.get("physics")
    chemistry = data.get("chemistry")

    if maths is None or physics is None or chemistry is None:
        return jsonify({"error": "Mathematics, Physics, and Chemistry marks are all required."}), 400

    try:
        res = calculate_tnea_cutoff(maths, physics, chemistry)
        return jsonify(res)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@cutoff_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json() or {}
    student_cutoff = data.get("student_cutoff")
    closing_cutoff = data.get("closing_cutoff")
    community = data.get("community", "BC")
    college_code = data.get("college_code", "0001")
    branch_code = data.get("branch_code", "CSE")
    admission_year = data.get("admission_year", 2023)

    if student_cutoff is None or closing_cutoff is None:
        return jsonify({"error": "Both student_cutoff and closing_cutoff are required."}), 400

    try:
        prediction = predict_single(
            student_cutoff=float(student_cutoff),
            closing_cutoff=float(closing_cutoff),
            community=community,
            college_code=str(college_code),
            branch_code=str(branch_code),
            admission_year=int(admission_year)
        )
        return jsonify(prediction)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@cutoff_bp.route("/ml-metrics", methods=["GET"])
def get_ml_metrics():
    try:
        metrics = load_metrics()
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": f"Unable to load ML metrics: {str(e)}"}), 500
