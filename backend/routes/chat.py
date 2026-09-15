from flask import Blueprint, request, jsonify
from services.chatbot_service import generate_counselor_response
from database import get_db_connection

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")

def get_user_id_and_profile_from_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer tnea-auth-"):
        return None, None
    try:
        user_id = int(auth_header.replace("Bearer tnea-auth-", "").split("-")[0])
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM student_profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        profile = dict(row) if row else None
        return user_id, profile
    except Exception:
        return None, None

@chat_bp.route("", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"error": "Message is required."}), 400

    user_id, token_profile = get_user_id_and_profile_from_token()
    profile = data.get("student_profile") or token_profile or {}

    try:
        response_payload = generate_counselor_response(message, profile)

        # Log chat message if user is authenticated
        if user_id:
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)", (user_id, "user", message))
                cursor.execute("INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)", (user_id, "assistant", response_payload["answer"]))
                conn.commit()
                conn.close()
            except Exception:
                pass

        return jsonify(response_payload)
    except Exception as e:
        return jsonify({"error": f"Counselor service error: {str(e)}"}), 500
