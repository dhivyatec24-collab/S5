import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

def get_preprocessor(categorical_features, numeric_features):
    """
    Builds a ColumnTransformer that one-hot encodes categorical features
    and passes through numerical features.
    """
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )
    return preprocessor

def create_training_samples_from_cutoffs(cutoffs_df, n_samples_per_row=15, random_state=42):
    """
    Generates a realistic student distribution around historical TNEA closing cutoffs.
    Anchor ground truth is the historical closing cutoff for each College + Branch + Community + Year.
    A candidate student has a cutoff within +/- 8 marks of the historical closing cutoff.
    Labels are derived strictly from the cutoff difference:
      - Safe: student_cutoff - closing_cutoff >= 1.5
      - Target: -2.0 <= student_cutoff - closing_cutoff < 1.5
      - Dream: student_cutoff - closing_cutoff < -2.0
    """
    np.random.seed(random_state)
    records = []

    for _, row in cutoffs_df.iterrows():
        closing = float(row["closing_cutoff"])
        college_code = str(row["college_code"])
        branch_code = str(row["branch_code"])
        community = str(row["community"])
        year = int(row["admission_year"])

        for _ in range(n_samples_per_row):
            # Sample delta from normal distribution with spread around 3.5
            delta = np.random.normal(loc=0.0, scale=3.2)
            # Clip student cutoff to legal range [0, 200]
            student_cutoff = round(float(np.clip(closing + delta, 50.0, 200.0)), 2)
            effective_delta = round(student_cutoff - closing, 2)

            if effective_delta >= 1.5:
                label = "Safe"
            elif effective_delta >= -2.0:
                label = "Target"
            else:
                label = "Dream"

            records.append({
                "student_cutoff": student_cutoff,
                "closing_cutoff": closing,
                "cutoff_delta": effective_delta,
                "community": community,
                "college_code": college_code,
                "branch_code": branch_code,
                "admission_year": year,
                "likelihood_tier": label
            })

    return pd.DataFrame(records)
