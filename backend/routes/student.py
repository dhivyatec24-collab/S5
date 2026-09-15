from flask import Blueprint, request, jsonify
from database import get_db_connection
from services.cutoff_service import calculate_tnea_cutoff
from config import Config

student_bp = Blueprint("student", __name__, url_prefix="/api/student")

def get_user_id_from_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer tnea-auth-"):
        return None
    try:
        return int(auth_header.replace("Bearer tnea-auth-", "").split("-")[0])
    except Exception:
        return None

@student_bp.route("/profile", methods=["GET"])
def get_profile():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.id, u.email, u.full_name,
           p.board, p.marks_12th, p.maths, p.physics, p.chemistry,
           p.calculated_cutoff, p.preferred_branch, p.preferred_district,
           p.budget, p.hostel_required, p.community
    FROM users u
    JOIN student_profiles p ON u.id = p.user_id
    WHERE u.id = ?
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "profile": {
            "user_id": row["id"],
            "name": row["full_name"],
            "email": row["email"],
            "board": row["board"],
            "marks_12th": row["marks_12th"],
            "maths": row["maths"],
            "physics": row["physics"],
            "chemistry": row["chemistry"],
            "calculated_cutoff": row["calculated_cutoff"],
            "preferred_branch": row["preferred_branch"],
            "preferred_district": row["preferred_district"],
            "budget": row["budget"],
            "hostel_required": bool(row["hostel_required"]),
            "community": row["community"]
        }
    })

@student_bp.route("/profile", methods=["PUT"])
def update_profile():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}

    board = data.get("board")
    if board and board not in Config.ALLOWED_BOARDS:
        return jsonify({
            "error": "This admission counselor is currently designed for Tamil Nadu State Board and CBSE students applying for engineering through TNEA."
        }), 400

    maths = data.get("maths")
    physics = data.get("physics")
    chemistry = data.get("chemistry")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM student_profiles WHERE user_id = ?", (user_id,))
    current = cursor.fetchone()

    if not current:
        conn.close()
        return jsonify({"error": "Profile not found"}), 404

    m = float(maths if maths is not None else current["maths"])
    p = float(physics if physics is not None else current["physics"])
    c = float(chemistry if chemistry is not None else current["chemistry"])

    try:
        cutoff_info = calculate_tnea_cutoff(m, p, c)
        new_cutoff = cutoff_info["calculated_cutoff"]
    except ValueError as e:
        conn.close()
        return jsonify({"error": str(e)}), 400

    name = data.get("name")
    if name:
        cursor.execute("UPDATE users SET full_name = ? WHERE id = ?", (name.strip(), user_id))

    new_board = board or current["board"]
    pref_branch = data.get("preferred_branch", current["preferred_branch"])
    pref_district = data.get("preferred_district", current["preferred_district"])
    budget = float(data.get("budget", current["budget"]))
    hostel_required = int(data.get("hostel_required", current["hostel_required"]))
    community = str(data.get("community", current["community"])).upper()
    marks_12th = float(data.get("marks_12th", m + p + c))

    cursor.execute("""
    UPDATE student_profiles
    SET board = ?, maths = ?, physics = ?, chemistry = ?, marks_12th = ?,
        calculated_cutoff = ?, preferred_branch = ?, preferred_district = ?,
        budget = ?, hostel_required = ?, community = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
    """, (
        new_board, m, p, c, marks_12th, new_cutoff, pref_branch, pref_district,
        budget, hostel_required, community, user_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Student profile updated successfully!",
        "profile": {
            "name": name or "Student",
            "board": new_board,
            "maths": m,
            "physics": p,
            "chemistry": c,
            "calculated_cutoff": new_cutoff,
            "preferred_branch": pref_branch,
            "preferred_district": pref_district,
            "budget": budget,
            "hostel_required": bool(hostel_required),
            "community": community
        }
    })
