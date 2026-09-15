def calculate_tnea_cutoff(maths, physics, chemistry):
    """
    Standard TNEA Engineering Cutoff Calculation:
    Mathematics = 100 max
    Physics = 50 max (converted from 100)
    Chemistry = 50 max (converted from 100)
    Total Cutoff = Mathematics + (Physics / 2) + (Chemistry / 2)
    Maximum = 200
    """
    for subject, mark in [("Mathematics", maths), ("Physics", physics), ("Chemistry", chemistry)]:
        try:
            val = float(mark)
        except (ValueError, TypeError):
            raise ValueError(f"Please enter a valid numeric mark for {subject}.")
        if val < 0.0 or val > 100.0:
            raise ValueError(f"Please enter marks between 0 and 100 for {subject}. Received {val}.")

    m = float(maths)
    p = float(physics)
    c = float(chemistry)

    p_weight = round(p / 2.0, 2)
    c_weight = round(c / 2.0, 2)
    total_cutoff = round(m + p_weight + c_weight, 2)

    return {
        "maths": m,
        "physics": p,
        "chemistry": c,
        "maths_weighted": m,
        "physics_weighted": p_weight,
        "chemistry_weighted": c_weight,
        "calculated_cutoff": total_cutoff,
        "max_cutoff": 200.0,
        "formula": "Engineering Cutoff = Mathematics + (Physics / 2) + (Chemistry / 2)",
        "example_explanation": f"{m} + ({p}/2) + ({c}/2) = {m} + {p_weight} + {c_weight} = {total_cutoff} / 200"
    }
