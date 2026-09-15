import json
from database import get_db_connection

def compare_colleges(college_ids, student_profile=None):
    """
    Compares 2 to 4 colleges side-by-side and calculates an intelligent
    'Which one suits me better?' recommendation based on the student's profile.
    """
    if not college_ids or len(college_ids) < 2:
        raise ValueError("Please select at least 2 colleges to compare.")
    if len(college_ids) > 4:
        college_ids = college_ids[:4]

    conn = get_db_connection()
    cursor = conn.cursor()
    placeholders = ",".join(["?"] * len(college_ids))
    cursor.execute(f"SELECT * FROM colleges WHERE id IN ({placeholders})", college_ids)
    rows = cursor.fetchall()
    conn.close()

    colleges = []
    # Preserve order of requested IDs
    row_map = {r["id"]: r for r in rows}
    for cid in college_ids:
        if cid in row_map:
            r = row_map[cid]
            colleges.append({
                "id": r["id"],
                "code": r["code"],
                "name": r["name"],
                "short_name": r["short_name"],
                "type": r["type"],
                "district": r["district"],
                "location": r["location"],
                "established_year": r["established_year"],
                "affiliation": r["affiliation"],
                "accreditation": r["accreditation"],
                "nirf_rank": r["nirf_rank"],
                "overall_rating": r["overall_rating"],
                "rating_breakdown": json.loads(r["rating_breakdown"]),
                "fees": json.loads(r["fees"]),
                "hostel": json.loads(r["hostel"]),
                "placements": json.loads(r["placements"]),
                "infrastructure": json.loads(r["infrastructure"]),
                "images": json.loads(r["images"]),
                "branches": json.loads(r["branches"]),
                "rating_source": r["rating_source"]
            })

    # Perform 'Which one suits me better?' analysis
    suitability_analysis = None
    if student_profile and colleges:
        cutoff = float(student_profile.get("calculated_cutoff", 185.0))
        pref_branch = str(student_profile.get("preferred_branch", "Computer Science and Engineering")).lower()
        budget = float(student_profile.get("budget", 200000))
        hostel_req = bool(student_profile.get("hostel_required", False))
        community = str(student_profile.get("community", "BC")).upper()
        pref_district = str(student_profile.get("preferred_district", "All")).lower()

        scores = []
        for c in colleges:
            score = 0
            reasons = []

            # 1. Cutoff match (30 pts)
            # Check closing cutoff for preferred branch or first available branch
            branch_cutoffs = []
            for b in c["branches"]:
                if pref_branch in b["branch_name"].lower() or "All" in pref_branch:
                    c_cut = b.get("cutoffs_2023", {}).get(community) or b.get("cutoffs_2023", {}).get("OC")
                    if c_cut:
                        branch_cutoffs.append(float(c_cut))

            if branch_cutoffs:
                min_cut = min(branch_cutoffs)
                delta = cutoff - min_cut
                if delta >= 2.0:
                    score += 30
                    reasons.append(f"Safe cutoff margin (+{delta:.1f} marks)")
                elif delta >= -1.5:
                    score += 26
                    reasons.append(f"Competitive target cutoff ({delta:+.1f} marks)")
                else:
                    score += 15
                    reasons.append(f"Ambitious dream cutoff ({delta:+.1f} marks)")
            else:
                score += 20

            # 2. Placement Performance (25 pts)
            place_pct = c["placements"].get("placement_percentage", 80)
            avg_pkg = c["placements"].get("average_package_lpa", 6.0)
            place_score = min(15, (place_pct / 100.0) * 15)
            pkg_score = min(10, (avg_pkg / 12.0) * 10)
            score += (place_score + pkg_score)
            reasons.append(f"{place_pct}% placement with ₹{avg_pkg} LPA avg package")

            # 3. Budget Fit (20 pts)
            tuition = c["fees"].get("tuition_fee_annual", 0)
            hostel_fee = c["fees"].get("hostel_fee_annual", 0) if hostel_req else 0
            total_annual = tuition + hostel_fee

            if total_annual <= budget:
                score += 20
                reasons.append(f"Comfortably within your ₹{budget:,.0f} budget (Total: ₹{total_annual:,.0f}/yr)")
            elif total_annual <= budget * 1.15:
                score += 14
                reasons.append(f"Slightly above budget (Total: ₹{total_annual:,.0f}/yr)")
            else:
                score += 8
                reasons.append(f"Exceeds preferred budget (Total: ₹{total_annual:,.0f}/yr)")

            # 4. Hostel Requirement (15 pts)
            if hostel_req:
                if c["hostel"].get("available", False):
                    score += 15
                    reasons.append("Hostel facilities verified and available")
                else:
                    score += 0
                    reasons.append("Hostel not readily available")
            else:
                score += 15

            # 5. Location Preference (10 pts)
            if pref_district != "all" and pref_district in c["district"].lower():
                score += 10
                reasons.append(f"Located in your preferred district ({c['district']})")
            else:
                score += 6

            scores.append({
                "college_id": c["id"],
                "college_name": c["name"],
                "short_name": c["short_name"],
                "suitability_score": round(score, 1),
                "key_highlights": reasons
            })

        scores.sort(key=lambda x: x["suitability_score"], reverse=True)
        top_college = scores[0]

        suitability_analysis = {
            "top_choice_id": top_college["college_id"],
            "top_choice_name": top_college["college_name"],
            "top_choice_short": top_college["short_name"],
            "scores": scores,
            "verdict": f"Based on your cutoff ({cutoff}), {pref_branch} preference, and annual budget, {top_college['short_name']} emerges as your highest-scoring match ({top_college['suitability_score']}/100)."
        }

    return {
        "colleges": colleges,
        "suitability_analysis": suitability_analysis
    }
