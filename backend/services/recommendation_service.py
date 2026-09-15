import json
import os
import sys

# Ensure ml package is accessible
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(backend_dir)
sys.path.append(os.path.join(root_dir, "ml"))

from prediction.predict import predict_single
from database import get_db_connection

def get_recommendations_for_student(student_profile):
    """
    Evaluates colleges & branches against the student profile and Random Forest model.
    student_profile dict:
      - calculated_cutoff (float)
      - community (e.g. 'OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST')
      - preferred_branch (e.g. 'Computer Science and Engineering' or 'All')
      - preferred_district (e.g. 'Coimbatore' or 'All')
      - budget (float max annual tuition)
      - hostel_required (bool or int)
    """
    cutoff = float(student_profile.get("calculated_cutoff", 185.0))
    community = str(student_profile.get("community", "BC")).upper()
    pref_branch = str(student_profile.get("preferred_branch", "All")).strip()
    pref_district = str(student_profile.get("preferred_district", "All")).strip()
    budget = float(student_profile.get("budget", 200000))
    hostel_req = bool(student_profile.get("hostel_required", False))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM colleges")
    colleges_rows = cursor.fetchall()
    conn.close()

    dream_list = []
    target_list = []
    safe_list = []

    for row in colleges_rows:
        college_id = row["id"]
        college_code = row["code"]
        college_name = row["name"]
        short_name = row["short_name"]
        college_type = row["type"]
        district = row["district"]
        overall_rating = row["overall_rating"]
        fees = json.loads(row["fees"])
        hostel = json.loads(row["hostel"])
        placements = json.loads(row["placements"])
        branches = json.loads(row["branches"])

        # Check district filter if specified
        if pref_district != "All" and pref_district.lower() not in district.lower():
            continue

        # Check budget filter against day scholar tuition fee
        tuition = fees.get("tuition_fee_annual", 0)
        if tuition > budget:
            continue

        # Check hostel requirement if strictly needed
        if hostel_req and not hostel.get("available", False):
            continue

        for b in branches:
            branch_name = b["branch_name"]
            branch_code = b["branch_code"]

            # Filter branch if preferred branch is specified and not 'All'
            if pref_branch != "All" and pref_branch.lower() not in branch_name.lower():
                # Allow related computer science / IT / AI branches if CSE is selected
                if "computer" in pref_branch.lower() and not any(k in branch_name.lower() for k in ["computer", "information", "artificial", "data", "cyber"]):
                    continue
                elif "computer" not in pref_branch.lower() and pref_branch.lower() not in branch_name.lower():
                    continue

            cutoffs_2023 = b.get("cutoffs_2023", {})
            closing_cutoff = cutoffs_2023.get(community) or cutoffs_2023.get("OC")

            if closing_cutoff is None:
                continue

            closing_cutoff = float(closing_cutoff)

            # ML Random Forest Prediction
            ml_res = predict_single(
                student_cutoff=cutoff,
                closing_cutoff=closing_cutoff,
                community=community,
                college_code=college_code,
                branch_code=branch_code,
                admission_year=2023
            )

            tier = ml_res["tier"]
            delta = ml_res["delta"]
            prob_percent = round(ml_res["confidence"] * 100, 1)

            item = {
                "college_id": college_id,
                "college_code": college_code,
                "college_name": college_name,
                "short_name": short_name,
                "college_type": college_type,
                "district": district,
                "branch_name": branch_name,
                "branch_code": branch_code,
                "student_cutoff": cutoff,
                "historical_cutoff": closing_cutoff,
                "cutoff_delta": delta,
                "tier": tier,
                "admission_probability": prob_percent,
                "reason": ml_res["reason"],
                "tuition_fee": fees.get("tuition_fee_annual"),
                "hostel_fee": fees.get("hostel_fee_annual"),
                "overall_rating": overall_rating,
                "placement_percentage": placements.get("placement_percentage"),
                "average_package_lpa": placements.get("average_package_lpa"),
                "highest_package_lpa": placements.get("highest_package_lpa")
            }

            if tier == "Dream":
                dream_list.append(item)
            elif tier == "Target":
                target_list.append(item)
            else:
                safe_list.append(item)

    # Sort within tiers
    dream_list.sort(key=lambda x: abs(x["cutoff_delta"]))  # closest dream first
    target_list.sort(key=lambda x: x["cutoff_delta"], reverse=True)
    safe_list.sort(key=lambda x: x["cutoff_delta"], reverse=True)

    return {
        "student_cutoff": cutoff,
        "community": community,
        "total_matches": len(dream_list) + len(target_list) + len(safe_list),
        "dream_colleges": dream_list[:12],
        "target_colleges": target_list[:15],
        "safe_colleges": safe_list[:15],
        "disclaimer": "Recommendations and admission likelihoods are estimated using authentic TNEA 2022-2023 closing cutoffs and Random Forest evaluation. These do not guarantee future admission."
    }
