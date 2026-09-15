from flask import Blueprint, request, jsonify
from services.recommendation_service import get_recommendations_for_student
from database import get_db_connection

recommendations_bp = Blueprint("recommendations", __name__, url_prefix="/api/recommendations")

def get_profile_from_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer tnea-auth-"):
        return None
    try:
        user_id = int(auth_header.replace("Bearer tnea-auth-", "").split("-")[0])
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM student_profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return dict(row)
    except Exception:
        pass
    return None

@recommendations_bp.route("", methods=["POST", "GET"])
def get_recommendations():
    profile = {}

    # Check for logged-in profile first
    auth_profile = get_profile_from_token()
    if auth_profile:
        profile.update(auth_profile)

    # Merge or override with request payload if POST
    if request.method == "POST":
        data = request.get_json() or {}
        profile.update(data)
    elif request.method == "GET":
        # Allow query params for quick testing
        if request.args.get("cutoff"):
            profile["calculated_cutoff"] = float(request.args.get("cutoff"))
        if request.args.get("community"):
            profile["community"] = request.args.get("community")
        if request.args.get("branch"):
            profile["preferred_branch"] = request.args.get("branch")
        if request.args.get("district"):
            profile["preferred_district"] = request.args.get("district")

    if not profile.get("calculated_cutoff"):
        profile["calculated_cutoff"] = 185.0

    try:
        recommendations = get_recommendations_for_student(profile)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": f"Failed to compute recommendations: {str(e)}"}), 500
