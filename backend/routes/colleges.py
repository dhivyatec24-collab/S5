import json
from flask import Blueprint, request, jsonify
from database import get_db_connection

colleges_bp = Blueprint("colleges", __name__, url_prefix="/api/colleges")

def format_college_row(row):
    return {
        "id": row["id"],
        "code": row["code"],
        "name": row["name"],
        "short_name": row["short_name"],
        "type": row["type"],
        "district": row["district"],
        "location": row["location"],
        "established_year": row["established_year"],
        "affiliation": row["affiliation"],
        "accreditation": row["accreditation"],
        "nirf_rank": row["nirf_rank"],
        "overall_rating": row["overall_rating"],
        "rating_breakdown": json.loads(row["rating_breakdown"]) if row["rating_breakdown"] else {},
        "fees": json.loads(row["fees"]) if row["fees"] else {},
        "hostel": json.loads(row["hostel"]) if row["hostel"] else {},
        "placements": json.loads(row["placements"]) if row["placements"] else {},
        "infrastructure": json.loads(row["infrastructure"]) if row["infrastructure"] else {},
        "images": json.loads(row["images"]) if row["images"] else {},
        "branches": json.loads(row["branches"]) if row["branches"] else [],
        "rating_source": row["rating_source"]
    }

@colleges_bp.route("", methods=["GET"])
def list_colleges():
    district = request.args.get("district", "").strip()
    branch = request.args.get("branch", "").strip()
    college_type = request.args.get("type", "").strip()
    hostel_req = request.args.get("hostel", "").strip().lower()
    max_budget = request.args.get("max_budget")
    min_rating = request.args.get("min_rating")
    search = request.args.get("search", "").strip().lower()
    cutoff = request.args.get("cutoff")
    community = request.args.get("community", "BC").upper()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM colleges ORDER BY overall_rating DESC")
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        c = format_college_row(r)

        # Search filter
        if search:
            searchable = f"{c['name']} {c['short_name']} {c['code']} {c['district']} {c['type']}".lower()
            if search not in searchable:
                continue

        # District filter
        if district and district.lower() != "all" and district.lower() not in c["district"].lower():
            continue

        # Type filter
        if college_type and college_type.lower() != "all" and college_type.lower() not in c["type"].lower():
            continue

        # Hostel filter
        if hostel_req in ["true", "1", "yes"] and not c["hostel"].get("available", False):
            continue

        # Budget filter
        if max_budget:
            try:
                b_limit = float(max_budget)
                if c["fees"].get("tuition_fee_annual", 0) > b_limit:
                    continue
            except ValueError:
                pass

        # Rating filter
        if min_rating:
            try:
                r_limit = float(min_rating)
                if (c.get("overall_rating") or 0) < r_limit:
                    continue
            except ValueError:
                pass

        # Branch filter
        if branch and branch.lower() != "all":
            has_branch = False
            for b in c["branches"]:
                if branch.lower() in b["branch_name"].lower():
                    has_branch = True
                    break
            if not has_branch:
                continue

        # Student cutoff eligibility tagging
        if cutoff:
            try:
                c_val = float(cutoff)
                eligible_branches = []
                for b in c["branches"]:
                    cut_req = b.get("cutoffs_2023", {}).get(community) or b.get("cutoffs_2023", {}).get("OC")
                    if cut_req:
                        diff = round(c_val - float(cut_req), 1)
                        eligible_branches.append({
                            "branch_name": b["branch_name"],
                            "branch_code": b["branch_code"],
                            "closing_cutoff": cut_req,
                            "delta": diff,
                            "eligible": diff >= -2.0
                        })
                c["student_branch_eligibility"] = eligible_branches
            except ValueError:
                pass

        results.append(c)

    return jsonify({
        "total": len(results),
        "colleges": results
    })

@colleges_bp.route("/<college_id>", methods=["GET"])
def get_college_details(college_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM colleges WHERE id = ? OR code = ?", (college_id, college_id))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": f"College '{college_id}' not found."}), 404

    return jsonify({"college": format_college_row(row)})

@colleges_bp.route("/<college_id>/placements", methods=["GET"])
def get_placements(college_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, short_name, placements FROM colleges WHERE id = ? OR code = ?", (college_id, college_id))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "College not found"}), 404

    placements = json.loads(row["placements"]) if row["placements"] else {}
    return jsonify({
        "college_id": row["id"],
        "college_name": row["name"],
        "placements": placements
    })

@colleges_bp.route("/<college_id>/hostel", methods=["GET"])
def get_hostel(college_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, short_name, hostel, fees FROM colleges WHERE id = ? OR code = ?", (college_id, college_id))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "College not found"}), 404

    hostel = json.loads(row["hostel"]) if row["hostel"] else {}
    fees = json.loads(row["fees"]) if row["fees"] else {}

    return jsonify({
        "college_id": row["id"],
        "college_name": row["name"],
        "hostel": hostel,
        "hostel_fee_annual": fees.get("hostel_fee_annual")
    })

@colleges_bp.route("/<college_id>/fees", methods=["GET"])
def get_fees(college_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, short_name, fees FROM colleges WHERE id = ? OR code = ?", (college_id, college_id))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "College not found"}), 404

    fees = json.loads(row["fees"]) if row["fees"] else {}
    return jsonify({
        "college_id": row["id"],
        "college_name": row["name"],
        "fees": fees
    })
