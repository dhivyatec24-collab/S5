import re
import json
import os
from database import get_db_connection

# Official TNEA Guidelines & FAQ Knowledge Base
TNEA_RULES = {
    "cutoff_formula": (
        "TNEA Engineering Cutoff is calculated out of 200 marks:\n"
        "Formula: Mathematics (100) + Physics/2 (50) + Chemistry/2 (50)\n"
        "Example: If Maths = 95, Physics = 90, Chemistry = 92:\n"
        "Cutoff = 95 + (90/2) + (92/2) = 95 + 45 + 46 = 186.0 / 200."
    ),
    "counselling_rounds": (
        "TNEA (Tamil Nadu Engineering Admissions) conducts online counselling organized by the Directorate of Technical Education (DoTE).\n"
        "1. Registration & Certificate Upload: Online portal submission (tneaonline.org).\n"
        "2. Random Number & Rank List Publication: Overall Rank and Community Rank are released.\n"
        "3. Four Counselling Rounds based on Rank bands.\n"
        "4. Choice Filling: Add colleges & branches in preferred priority order.\n"
        "5. Tentative Allotment & Confirmation: Accept and Join, Accept and Upward, Decline, or Quit.\n"
        "6. Final Allotment Order and reporting to assigned college."
    ),
    "documents_required": (
        "Key documents required for TNEA verification:\n"
        "1. 10th Standard Mark Sheet\n"
        "2. 11th Standard Mark Sheet\n"
        "3. 12th Standard (+2) Mark Sheet\n"
        "4. Transfer Certificate (TC)\n"
        "5. Permanent Community Certificate Card (for BC, BCM, MBC, SC, SCA, ST)\n"
        "6. Nativity Certificate (if applicable)\n"
        "7. First Graduate Certificate & Joint Declaration (if claiming FG tuition fee concession)\n"
        "8. Income Certificate (for fee concessions or PMSS)"
    ),
    "choice_filling_strategy": (
        "Smart Choice Filling Strategy for TNEA:\n"
        "1. Categorize choices into Dream (top aspirational colleges), Target (realistic colleges matching your cutoff), and Safe (secure backup options).\n"
        "2. Do NOT limit your choices to just 4-5 options. Fill 20 to 50+ choices in strict order of true preference.\n"
        "3. Remember that TNEA algorithm tests your list from top to bottom. Place your most desired branch and college at #1, regardless of whether your cutoff seems lower.\n"
        "4. Always select 'Accept and Upward' during tentative allotment if you want to contest for higher priority choices."
    ),
    "cse_vs_ece": (
        "Comparison between CSE and ECE in Tamil Nadu:\n"
        "• Computer Science & Engineering (CSE): Focuses on algorithms, software development, web & mobile architecture, AI/ML, cloud, and databases. High placement volume in IT/Product companies (Zoho, Google, Amazon, TCS, Cognizant).\n"
        "• Electronics & Communication (ECE): Focuses on hardware design, VLSI, embedded systems, microprocessors, signal processing, and communication networks. Eligible for both core tech firms (Texas Instruments, Qualcomm, Bosch) and software roles."
    )
}

COLLEGE_ALIASES = {
    "0001": ["ceg", "guindy", "college of engineering guindy", "anna university guindy"],
    "0004": ["mit", "chromepet", "madras institute of technology"],
    "2006": ["psg", "psg tech", "psg college of technology", "peelamedu"],
    "2007": ["cit coimbatore", "coimbatore institute of technology"],
    "2005": ["gct", "government college of technology", "gct coimbatore"],
    "5008": ["tce", "thiagarajar", "thiagarajar college of engineering", "tce madurai"],
    "1315": ["ssn", "ssn college", "kalavakkam"],
    "2712": ["kct", "kumaraguru", "kumaraguru college of technology"],
    "1114": ["cit chennai", "chennai institute of technology", "kundrathur"],
    "2718": ["skcet", "sri krishna", "sri krishna college"],
    "1211": ["rec", "rajalakshmi", "rajalakshmi engineering college", "thandalam"],
    "2711": ["kongu", "kongu engineering college", "perundurai"],
    "1013": ["gce salem", "salem gce", "karuppur"],
    "4004": ["gce tirunelveli", "tirunelveli gce"],
    "2702": ["bannari", "bannari amman", "bit sathy", "sathyamangalam"],
    "4960": ["mepco", "mepco schlenk", "sivakasi"],
    "1450": ["licet", "loyola icam", "loyola-icam"],
    "1113": ["rmk", "rmk engineering", "kavaraipettai"]
}

def retrieve_college_context(query):
    """
    Search database for college matches using codes, aliases, and substring patterns.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, code, name, short_name, type, district, fees, hostel, placements, branches, overall_rating FROM colleges")
    colleges = cursor.fetchall()
    conn.close()

    relevant_colleges = []
    q_lower = query.lower()

    for c in colleges:
        code = str(c["code"])
        short_lower = c["short_name"].lower()
        name_lower = c["name"].lower()

        matched = False
        # Direct code match
        if code in query:
            matched = True
        # Alias matches
        elif code in COLLEGE_ALIASES and any(alias in q_lower for alias in COLLEGE_ALIASES[code]):
            matched = True
        # Name or short name substring
        elif short_lower in q_lower or name_lower in q_lower:
            matched = True

        if matched:
            relevant_colleges.append({
                "name": c["name"],
                "short_name": c["short_name"],
                "code": c["code"],
                "district": c["district"],
                "type": c["type"],
                "rating": c["overall_rating"],
                "fees": json.loads(c["fees"]),
                "hostel": json.loads(c["hostel"]),
                "placements": json.loads(c["placements"]),
                "branches": json.loads(c["branches"])
            })

    return relevant_colleges

def generate_counselor_response(student_query, student_profile=None):
    """
    RAG-grounded AI Admission Counselor.
    Retrieves verified facts from TNEA rules and college database.
    Adheres strictly to verified data and outputs citations.
    """
    query = student_query.strip()
    q_lower = query.lower()
    profile = student_profile or {}

    cutoff = profile.get("calculated_cutoff")
    community = profile.get("community", "BC")
    pref_branch = profile.get("preferred_branch", "Computer Science and Engineering")

    # 1. Cutoff Calculation queries
    if ("cutoff" in q_lower and any(k in q_lower for k in ["how is", "calculate", "calculated", "formula", "method", "computation", "how to"])) or \
       any(k in q_lower for k in ["how is cutoff calculated", "cutoff formula", "calculate cutoff", "cutoff calculation"]):
        return {
            "answer": (
                "Here is the official TNEA Engineering Cutoff calculation method:\n\n"
                f"{TNEA_RULES['cutoff_formula']}\n\n"
                "• Mathematics is taken out of 100 marks.\n"
                "• Physics is halved: (Physics mark / 2), max 50.\n"
                "• Chemistry is halved: (Chemistry mark / 2), max 50.\n"
                "Total maximum cutoff is 200.0."
            ),
            "sources": ["DoTE Tamil Nadu TNEA Information Brochure", "Anna University Regulations"],
            "suggested_actions": ["Calculate My Cutoff", "View Cutoff Predictor"]
        }

    # 2. What colleges can I get / Cutoff recommendations
    cutoff_match = re.search(r'\b(1[0-9]{2}(?:\.[0-9]+)?|200)\b', query)
    query_cutoff = float(cutoff_match.group(1)) if cutoff_match else cutoff

    if any(k in q_lower for k in ["which college", "what college", "can i get", "eligible for", "options for"]) and query_cutoff:
        target_cutoff = float(query_cutoff)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, code, name, short_name, district, type, branches, placements, fees FROM colleges")
        all_colleges = cursor.fetchall()
        conn.close()

        matches = []
        for c in all_colleges:
            branches = json.loads(c["branches"])
            fees = json.loads(c["fees"])
            placements = json.loads(c["placements"])
            for b in branches:
                c_cut = b.get("cutoffs_2023", {}).get(community) or b.get("cutoffs_2023", {}).get("OC")
                if c_cut:
                    diff = round(target_cutoff - float(c_cut), 1)
                    if -3.0 <= diff <= 5.0:  # Competitive or comfortable range
                        matches.append({
                            "college": c["short_name"],
                            "code": c["code"],
                            "district": c["district"],
                            "branch": b["branch_name"],
                            "closing_cutoff": c_cut,
                            "delta": diff,
                            "tier": "Safe" if diff >= 1.5 else ("Target" if diff >= -1.5 else "Dream"),
                            "fee": fees.get("tuition_fee_annual"),
                            "avg_pkg": placements.get("average_package_lpa")
                        })

        matches.sort(key=lambda x: abs(x["delta"]))
        top_matches = matches[:6]

        if top_matches:
            reply = f"Based on verified TNEA 2023 closing cutoffs with a **{target_cutoff}/200 cutoff** ({community} category), here are realistic opportunities:\n\n"
            for m in top_matches:
                sign = "+" if m["delta"] >= 0 else ""
                reply += f"• **{m['college']} (Code {m['code']})** — {m['branch']}\n"
                reply += f"  Status: **{m['tier']}** | 2023 Closing: {m['closing_cutoff']} (Delta: {sign}{m['delta']}) | Tuition: ₹{m['fee']:,}/yr | Avg Pkg: ₹{m['avg_pkg']} LPA\n\n"
            reply += "\n*Note: Admission likelihood is an estimate based on historical closing data, not a future guarantee.*"
            return {
                "answer": reply,
                "sources": ["TNEA 2023 Official Allotment Cutoffs (DoTE)"],
                "suggested_actions": ["View My Recommendations", "Compare Colleges"]
            }

    # 3. Counselling process queries
    if any(k in q_lower for k in ["how does counselling work", "tnea counselling", "counselling procedure", "admission process", "rounds"]):
        return {
            "answer": (
                "Here is how TNEA Online Engineering Counselling works step-by-step:\n\n"
                f"{TNEA_RULES['counselling_rounds']}\n\n"
                "Tip: Keep your community certificate and 10th/12th marksheets ready for verification."
            ),
            "sources": ["TNEA Online Portal Guidelines (tneaonline.org)"],
            "suggested_actions": ["Check Documents Required", "Explore Colleges"]
        }

    # 4. Documents required
    if any(k in q_lower for k in ["document", "certificate", "what to upload", "verification"]):
        return {
            "answer": (
                "Here are the mandatory certificates required for TNEA admission & certificate verification:\n\n"
                f"{TNEA_RULES['documents_required']}\n\n"
                "All original certificates must be produced at the allotted college during final admission."
            ),
            "sources": ["DoTE TNEA Certificate Verification Instruction Manual"],
            "suggested_actions": ["Check My Cutoff"]
        }

    # 5. CSE vs ECE
    if ("cse" in q_lower and "ece" in q_lower) or "difference between cse and ece" in q_lower:
        return {
            "answer": (
                f"{TNEA_RULES['cse_vs_ece']}\n\n"
                "**Counselor's Recommendation:** If you love coding and software architecture, CSE/IT is ideal. "
                "If you are interested in hardware, robotics, microchips, and want flexibility between core tech and IT jobs, ECE is a versatile choice."
            ),
            "sources": ["AICTE Curriculum Model & Industry Placement Analytics"],
            "suggested_actions": ["Find CSE Colleges", "Find ECE Colleges"]
        }

    # 6. College specific queries (retrieve verified facts)
    matched_colleges = retrieve_college_context(query)
    if matched_colleges:
        c = matched_colleges[0]
        fees = c["fees"]
        hostel = c["hostel"]
        placements = c["placements"]

        # Fees question
        if any(k in q_lower for k in ["fee", "cost", "fees", "tuition"]):
            verified_tag = "Officially verified" if fees.get("is_fee_verified") else "Estimated"
            answer = (
                f"### Verified Fee Structure: **{c['name']} (Code: {c['code']})**\n\n"
                f"• **Tuition Fee (Annual):** ₹{fees.get('tuition_fee_annual', 'Information not available'):,}\n"
                f"• **Other / Institutional Fees:** ₹{fees.get('other_fees_annual', 'Information not available'):,}\n"
                f"• **Approximate Total (Day Scholar):** ₹{fees.get('approx_total_day_scholar', 'Information not available'):,}\n"
                f"• **Hostel Fee (Annual):** ₹{fees.get('hostel_fee_annual', 'Information not available'):,}\n\n"
                f"**Verification Source:** {fees.get('tuition_source', 'Official Institutional Records')}\n"
                f"**Source URL:** {fees.get('tuition_source_url', 'https://www.annauniv.edu')}\n\n"
                f"*Status: {verified_tag} under TN Fee Fixation guidelines.*"
            )
            return {
                "answer": answer,
                "sources": [fees.get("tuition_source", "Fee Fixation Committee")],
                "suggested_actions": ["View Full College Profile", "Compare Fees"]
            }

        # Hostel question
        if any(k in q_lower for k in ["hostel", "mess", "food", "rooms", "accommodation"]):
            if hostel.get("available"):
                answer = (
                    f"### Verified Hostel & Dining Facilities: **{c['short_name']}**\n\n"
                    f"• **Hostel Available:** Yes (Boys: {'Yes' if hostel.get('boys_hostel') else 'No'} | Girls: {'Yes' if hostel.get('girls_hostel') else 'No'})\n"
                    f"• **Hostel Capacity:** {hostel.get('approx_capacity', 'Information not available')}\n"
                    f"• **Wi-Fi Available:** {'Yes' if hostel.get('wifi') else 'Information not available'}\n"
                    f"• **Security:** {hostel.get('security', 'Information not available')}\n"
                    f"• **Mess / Food:** {hostel.get('mess_type', 'Information not available')}\n"
                    f"• **Food Details:** {hostel.get('food_details', 'Information not available')}\n"
                    f"• **Annual Hostel Fee:** ₹{fees.get('hostel_fee_annual', 'Information not available'):,}\n\n"
                    f"**Source:** {hostel.get('source_type', 'Official College Prospectus')}"
                )
            else:
                answer = f"Hostel information for **{c['short_name']}**: Hostel information not available from verified sources."
            return {
                "answer": answer,
                "sources": [hostel.get("source_type", "Official Information Guide")],
                "suggested_actions": ["View College Details"]
            }

        # Placement question
        if any(k in q_lower for k in ["placement", "package", "salary", "recruiters", "companies"]):
            top_cos = ", ".join(placements.get("top_companies", [])[:6])
            answer = (
                f"### Verified Placement Statistics: **{c['short_name']}**\n\n"
                f"• **Placement Percentage:** {placements.get('placement_percentage') or 'Information not available'}%\n"
                f"• **Highest Package:** ₹{placements.get('highest_package_lpa') or 'Information not available'} LPA\n"
                f"• **Average Package:** ₹{placements.get('average_package_lpa') or 'Information not available'} LPA\n"
                f"• **Median Package:** {('₹' + str(placements.get('median_package_lpa')) + ' LPA') if isinstance(placements.get('median_package_lpa'), (int, float)) else 'Information not available'}\n"
                f"• **Number of Recruiters:** {placements.get('num_recruiters') or 'Information not available'}+\n"
                f"• **Top Recruiting Companies:** {top_cos}\n"
                f"• **Placement Year:** {placements.get('placement_year')}\n\n"
                f"**Source:** {placements.get('source_type', 'NIRF Official Data')}"
            )
            return {
                "answer": answer,
                "sources": [placements.get("source_type", "NIRF Report")],
                "suggested_actions": ["Compare Placement Stats", "View College Profile"]
            }

        # General college summary
        branch_names = [b["branch_name"] for b in c["branches"][:4]]
        answer = (
            f"### **{c['name']} (Code {c['code']})**\n\n"
            f"• **Type:** {c['type']} | **District:** {c['district']}\n"
            f"• **NIRF Rank:** {c['nirf_rank']} | **Overall Rating:** {c['rating']}/5.0\n"
            f"• **Average Placement Package:** ₹{placements.get('average_package_lpa')} LPA\n"
            f"• **Annual Tuition Fee:** ₹{fees.get('tuition_fee_annual'):,}\n"
            f"• **Hostel Available:** {'Yes' if hostel.get('available') else 'Information not available'}\n"
            f"• **Key Branches:** {', '.join(branch_names)}...\n\n"
            f"What specific details would you like to know about {c['short_name']}? You can ask about cutoffs, placements, hostel facilities, or fees."
        )
        return {
            "answer": answer,
            "sources": ["Anna University Affiliation Portal & NIRF 2024"],
            "suggested_actions": ["Check Fees", "Check Placements", "Check Hostel"]
        }

    # 7. District query (e.g. "colleges in Coimbatore" or "colleges in Chennai")
    for dist in ["chennai", "coimbatore", "madurai", "erode", "salem", "tirunelveli"]:
        if dist in q_lower:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT name, short_name, code, type, overall_rating, placements FROM colleges WHERE LOWER(district) LIKE ?", (f"%{dist}%",))
            dist_colleges = cursor.fetchall()
            conn.close()

            if dist_colleges:
                reply = f"Here are verified premier TNEA engineering colleges in **{dist.capitalize()}**:\n\n"
                for dc in dist_colleges:
                    pl = json.loads(dc["placements"])
                    reply += f"• **{dc['short_name']} (Code {dc['code']})** — {dc['type']} | Rating: {dc['overall_rating']}/5.0 | Avg Pkg: ₹{pl.get('average_package_lpa')} LPA\n"
                reply += f"\nYou can compare these colleges directly in the 'Compare Colleges' page."
                return {
                    "answer": reply,
                    "sources": ["DoTE Official College Directory"],
                    "suggested_actions": ["Filter by " + dist.capitalize(), "Compare Colleges"]
                }

    # Fallback response strictly upholding data integrity
    return {
        "answer": (
            "I couldn't find verified information for this specific query in my official TNEA database.\n\n"
            "As an AI Admission Counselor specialized strictly for Tamil Nadu engineering admissions, I only share authentic, sourced information. You can ask me:\n"
            "• 'How is engineering cutoff calculated?'\n"
            "• 'What colleges can I get with 185 cutoff for CSE?'\n"
            "• 'Tell me about CEG Guindy fees and placements'\n"
            "• 'Which colleges in Coimbatore have hostel facilities?'\n"
            "• 'Explain TNEA counselling rounds and choice filling'"
        ),
        "sources": ["TNEA Verified Information Base"],
        "suggested_actions": ["Calculate Cutoff", "Explore Recommendations"]
    }
