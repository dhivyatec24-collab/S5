import hashlib
import os
import json
import sqlite3
from flask import Blueprint, request, jsonify
from config import Config
from database import get_db_connection
from services.cutoff_service import calculate_tnea_cutoff

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

def hash_password(password, salt=None):
    if not salt:
        salt = os.urandom(16).hex()
    hashed = hashlib.sha256((password + salt).encode("utf-8")).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(stored_hash, password):
    try:
        salt, expected_hash = stored_hash.split(":")
        check_hash = hashlib.sha256((password + salt).encode("utf-8")).hexdigest()
        return check_hash == expected_hash
    except Exception:
        return False

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    board = data.get("board", "").strip()

    if not name or not email or not password or not board:
        return jsonify({"error": "Name, email, password, and board are required."}), 400

    # Strict Board Eligibility Guardrail
    if board not in Config.ALLOWED_BOARDS:
        return jsonify({
            "error": "This admission counselor is currently designed for Tamil Nadu State Board and CBSE students applying for engineering through TNEA.",
            "unsupported_board": True
        }), 403

    maths = data.get("maths", 0)
    physics = data.get("physics", 0)
    chemistry = data.get("chemistry", 0)
    pref_branch = data.get("preferred_branch", "Computer Science and Engineering")
    pref_district = data.get("preferred_district", "All")
    budget = float(data.get("budget", 150000))
    hostel_required = int(data.get("hostel_required", 1))
    community = data.get("community", "BC").upper()

    try:
        cutoff_info = calculate_tnea_cutoff(maths, physics, chemistry)
        calc_cutoff = cutoff_info["calculated_cutoff"]
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if email exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({"error": "An account with this email already exists. Please log in."}), 409

        password_hash = hash_password(password)
        cursor.execute(
            "INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)",
            (email, password_hash, name)
        )
        user_id = cursor.lastrowid

        total_12th = float(data.get("marks_12th", float(maths) + float(physics) + float(chemistry)))

        cursor.execute("""
        INSERT INTO student_profiles (
            user_id, board, marks_12th, maths, physics, chemistry,
            calculated_cutoff, preferred_branch, preferred_district,
            budget, hostel_required, community
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, board, total_12th, float(maths), float(physics), float(chemistry),
            calc_cutoff, pref_branch, pref_district, budget, hostel_required, community
        ))

        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500
    finally:
        conn.close()

    # Generate token payload
    token = f"tnea-auth-{user_id}-{hashlib.md5(email.encode()).hexdigest()}"

    return jsonify({
        "message": "Registration successful! Welcome to Smart College Admission Counselor.",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "board": board,
            "calculated_cutoff": calc_cutoff,
            "community": community,
            "preferred_branch": pref_branch,
            "preferred_district": pref_district,
            "budget": budget,
            "hostel_required": bool(hostel_required)
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.id, u.email, u.password_hash, u.full_name,
           p.board, p.marks_12th, p.maths, p.physics, p.chemistry,
           p.calculated_cutoff, p.preferred_branch, p.preferred_district,
           p.budget, p.hostel_required, p.community
    FROM users u
    LEFT JOIN student_profiles p ON u.id = p.user_id
    WHERE u.email = ?
    """, (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or not verify_password(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    token = f"tnea-auth-{user['id']}-{hashlib.md5(email.encode()).hexdigest()}"

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["full_name"],
            "email": user["email"],
            "board": user["board"],
            "maths": user["maths"],
            "physics": user["physics"],
            "chemistry": user["chemistry"],
            "calculated_cutoff": user["calculated_cutoff"],
            "community": user["community"],
            "preferred_branch": user["preferred_branch"],
            "preferred_district": user["preferred_district"],
            "budget": user["budget"],
            "hostel_required": bool(user["hostel_required"])
        }
    })

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer tnea-auth-"):
        return jsonify({"error": "Authentication required."}), 401

    try:
        user_id = int(auth_header.replace("Bearer tnea-auth-", "").split("-")[0])
    except Exception:
        return jsonify({"error": "Invalid auth token."}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.id, u.email, u.full_name,
           p.board, p.marks_12th, p.maths, p.physics, p.chemistry,
           p.calculated_cutoff, p.preferred_branch, p.preferred_district,
           p.budget, p.hostel_required, p.community
    FROM users u
    LEFT JOIN student_profiles p ON u.id = p.user_id
    WHERE u.id = ?
    """, (user_id,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "user": {
            "id": user["id"],
            "name": user["full_name"],
            "email": user["email"],
            "board": user["board"],
            "maths": user["maths"],
            "physics": user["physics"],
            "chemistry": user["chemistry"],
            "calculated_cutoff": user["calculated_cutoff"],
            "community": user["community"],
            "preferred_branch": user["preferred_branch"],
            "preferred_district": user["preferred_district"],
            "budget": user["budget"],
            "hostel_required": bool(user["hostel_required"])
        }
    })
