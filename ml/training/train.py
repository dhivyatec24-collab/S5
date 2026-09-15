import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

# Ensure imports resolve
current_dir = os.path.dirname(os.path.abspath(__file__))
ml_root = os.path.dirname(current_dir)
sys.path.append(ml_root)

from preprocessing.preprocessor import get_preprocessor, create_training_samples_from_cutoffs

def train_model():
    data_path = os.path.join(ml_root, "..", "data", "cutoffs.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Cutoffs dataset not found at {data_path}")

    print(f"Loading authentic historical cutoffs from {data_path}...")
    cutoffs_df = pd.read_csv(data_path)
    print(f"Loaded {len(cutoffs_df)} historical cutoff records.")

    print("Generating student application samples anchored on authentic TNEA data...")
    dataset = create_training_samples_from_cutoffs(cutoffs_df, n_samples_per_row=25, random_state=42)
    print(f"Generated {len(dataset)} student evaluation samples.")

    feature_cols = [
        "student_cutoff",
        "closing_cutoff",
        "cutoff_delta",
        "community",
        "college_code",
        "branch_code",
        "admission_year"
    ]
    numeric_features = ["student_cutoff", "closing_cutoff", "cutoff_delta", "admission_year"]
    categorical_features = ["community", "college_code", "branch_code"]

    X = dataset[feature_cols]
    y = dataset["likelihood_tier"]

    # Stratified Train-Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    print(f"Training set: {len(X_train)} samples, Test set: {len(X_test)} samples.")

    preprocessor = get_preprocessor(categorical_features, numeric_features)

    rf_classifier = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        class_weight="balanced"
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', rf_classifier)
    ])

    print("Training Random Forest Classifier pipeline...")
    pipeline.fit(X_train, y_train)

    print("Evaluating model performance on holdout test set...")
    y_pred = pipeline.predict(X_test)

    # Compute genuine metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
    rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

    report = classification_report(y_test, y_pred, output_dict=True)

    metrics_payload = {
        "model_name": "Random Forest Admission Likelihood Classifier",
        "algorithm": "RandomForestClassifier (scikit-learn)",
        "n_estimators": 120,
        "max_depth": 12,
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "evaluation_metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4)
        },
        "class_breakdown": {
            k: {
                "precision": round(v["precision"], 4),
                "recall": round(v["recall"], 4),
                "f1-score": round(v["f1-score"], 4),
                "support": int(v["support"])
            }
            for k, v in report.items() if isinstance(v, dict)
        },
        "disclaimer": "Historical-data-based admission likelihood estimate based on TNEA 2022-2023 closing cutoffs. Does not guarantee future seat allotment."
    }

    models_dir = os.path.join(ml_root, "models")
    os.makedirs(models_dir, exist_ok=True)

    model_file = os.path.join(models_dir, "random_forest_admission.joblib")
    joblib.dump(pipeline, model_file)
    print(f"Saved trained pipeline to {model_file}")

    metrics_file = os.path.join(models_dir, "ml_metrics.json")
    with open(metrics_file, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"Saved model metrics to {metrics_file}")

    print("\n--- Model Evaluation Summary ---")
    print(f"Accuracy : {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall   : {rec * 100:.2f}%")
    print(f"F1-Score : {f1 * 100:.2f}%")
    print("--------------------------------\n")

    return metrics_payload

if __name__ == "__main__":
    train_model()
