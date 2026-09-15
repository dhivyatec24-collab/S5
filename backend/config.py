import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

class Config:
    BASE_DIR = BASE_DIR
    ROOT_DIR = ROOT_DIR
    SECRET_KEY = os.environ.get("SECRET_KEY", "tnea-smart-counselor-secret-key-2026")
    DATABASE_PATH = os.path.join(BASE_DIR, "counselor.db")
    DATA_COLLEGES_PATH = os.path.join(ROOT_DIR, "data", "tnea_colleges.json")
    ML_MODEL_PATH = os.path.join(ROOT_DIR, "ml", "models", "random_forest_admission.joblib")
    ML_METRICS_PATH = os.path.join(ROOT_DIR, "ml", "models", "ml_metrics.json")
    
    ALLOWED_BOARDS = ["Tamil Nadu State Board", "CBSE"]
    MAX_CUTOFF = 200.0
    MIN_MARKS = 0.0
    MAX_MARKS = 100.0
