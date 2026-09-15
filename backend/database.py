import sqlite3
import json
import os
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Student Profiles Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_profiles (
        user_id INTEGER PRIMARY KEY,
        board TEXT NOT NULL,
        marks_12th REAL DEFAULT 0,
        maths REAL DEFAULT 0,
        physics REAL DEFAULT 0,
        chemistry REAL DEFAULT 0,
        calculated_cutoff REAL DEFAULT 0,
        preferred_branch TEXT DEFAULT 'Computer Science and Engineering',
        preferred_district TEXT DEFAULT 'All',
        budget REAL DEFAULT 150000,
        hostel_required INTEGER DEFAULT 1,
        community TEXT DEFAULT 'BC',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)

    # Colleges Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS colleges (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        short_name TEXT NOT NULL,
        type TEXT NOT NULL,
        district TEXT NOT NULL,
        location TEXT NOT NULL,
        established_year INTEGER,
        affiliation TEXT,
        accreditation TEXT,
        nirf_rank TEXT,
        overall_rating REAL,
        rating_breakdown TEXT,
        fees TEXT,
        hostel TEXT,
        placements TEXT,
        infrastructure TEXT,
        images TEXT,
        branches TEXT,
        rating_source TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Chat History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    );
    """)

    conn.commit()

    if os.path.exists(Config.DATA_COLLEGES_PATH):
        print(f"Syncing verified TNEA colleges from {Config.DATA_COLLEGES_PATH}...")
        with open(Config.DATA_COLLEGES_PATH, "r", encoding="utf-8") as f:
            colleges_data = json.load(f)

        for c in colleges_data:
            cursor.execute("""
            INSERT OR REPLACE INTO colleges (
                id, code, name, short_name, type, district, location,
                established_year, affiliation, accreditation, nirf_rank,
                overall_rating, rating_breakdown, fees, hostel, placements,
                infrastructure, images, branches, rating_source
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c["id"],
                c["code"],
                c["name"],
                c["short_name"],
                c["type"],
                c["district"],
                c["location"],
                c.get("established_year"),
                c.get("affiliation"),
                c.get("accreditation"),
                c.get("nirf_rank"),
                c["rating_breakdown"]["overall"],
                json.dumps(c["rating_breakdown"]),
                json.dumps(c["fees"]),
                json.dumps(c["hostel"]),
                json.dumps(c["placements"]),
                json.dumps(c["infrastructure"]),
                json.dumps(c["images"]),
                json.dumps(c["branches"]),
                c.get("rating_source")
            ))

        conn.commit()
        print(f"Successfully synced {len(colleges_data)} colleges into database.")

    conn.close()

if __name__ == "__main__":
    init_db()
