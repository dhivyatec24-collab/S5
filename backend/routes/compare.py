from flask import Blueprint, request, jsonify
from services.comparison_service import compare_colleges
from database import get_db_connection

compare_bp = Blueprint("compare", __name__, url_prefix="/api/compare")

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

@compare_bp.route("", methods=["POST"])
def compare():
    data = request.get_json() or {}
    college_ids = data.get("college_ids", [])
    student_profile = data.get("student_profile")

    if not college_ids or len(college_ids) < 2:
        return jsonify({"error": "Please select between 2 and 4 colleges to compare."}), 400

    if not student_profile:
        student_profile = get_profile_from_token()

    try:
        result = compare_colleges(college_ids, student_profile)
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Comparison failed: {str(e)}"}), 500
