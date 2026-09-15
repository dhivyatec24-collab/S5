import unittest
import json
from app import create_app

class BackendAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_00_root_and_api_descriptor(self):
        root = self.client.get("/")
        self.assertEqual(root.status_code, 200)
        api = self.client.get("/api")
        self.assertEqual(api.status_code, 200)
        data = api.get_json()
        self.assertEqual(data["service"], "Smart College Admission Counselor Agent API")
        self.assertEqual(data["status"], "operational")
        self.assertIn("health", data["endpoints"])

    def test_01_health(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")

    def test_02_board_restriction(self):
        # Unsupported board should be rejected
        payload = {
            "name": "Arun Kumar",
            "email": "arun_icse@example.com",
            "password": "Password123!",
            "board": "ICSE",
            "maths": 90,
            "physics": 85,
            "chemistry": 88
        }
        res = self.client.post("/api/auth/register", json=payload)
        self.assertEqual(res.status_code, 403)
        data = res.get_json()
        self.assertIn("Tamil Nadu State Board and CBSE", data["error"])

    def test_03_registration_and_cutoff(self):
        import time
        ts = int(time.time())
        payload = {
            "name": "Karthik Subramanian",
            "email": f"karthik_{ts}@example.com",
            "password": "SecurePassword2026",
            "board": "Tamil Nadu State Board",
            "maths": 95,
            "physics": 90,
            "chemistry": 92,
            "community": "BC",
            "preferred_branch": "Computer Science and Engineering",
            "preferred_district": "Chennai",
            "budget": 100000,
            "hostel_required": 1
        }
        res = self.client.post("/api/auth/register", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        # Cutoff = 95 + 45 + 46 = 186.0
        self.assertEqual(data["user"]["calculated_cutoff"], 186.0)
        self.assertIn("token", data)

    def test_04_cutoff_calculator(self):
        payload = {"maths": 95, "physics": 90, "chemistry": 92}
        res = self.client.post("/api/cutoff/calculate", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["calculated_cutoff"], 186.0)
        self.assertEqual(data["physics_weighted"], 45.0)
        self.assertEqual(data["chemistry_weighted"], 46.0)

    def test_05_cutoff_ml_predict(self):
        payload = {
            "student_cutoff": 196.5,
            "closing_cutoff": 198.0,
            "community": "BC",
            "college_code": "0001",
            "branch_code": "CSE"
        }
        res = self.client.post("/api/cutoff/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("tier", data)
        self.assertIn("probabilities", data)

    def test_06_colleges_list_and_details(self):
        res = self.client.get("/api/colleges")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertGreater(data["total"], 5)
        first_id = data["colleges"][0]["id"]

        detail_res = self.client.get(f"/api/colleges/{first_id}")
        self.assertEqual(detail_res.status_code, 200)
        c = detail_res.get_json()["college"]
        self.assertIn("fees", c)
        self.assertIn("hostel", c)
        self.assertIn("placements", c)
        self.assertIn("branches", c)

    def test_07_compare_colleges(self):
        payload = {
            "college_ids": ["ceg-guindy-0001", "psg-tech-coimbatore-2006"],
            "student_profile": {
                "calculated_cutoff": 197.0,
                "preferred_branch": "Computer Science and Engineering",
                "community": "BC",
                "budget": 80000,
                "hostel_required": True
            }
        }
        res = self.client.post("/api/compare", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(len(data["colleges"]), 2)
        self.assertIn("suitability_analysis", data)

    def test_08_chatbot(self):
        # Query about cutoff formula
        res = self.client.post("/api/chat", json={"message": "How is engineering cutoff calculated?"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("Mathematics (100) + Physics/2", data["answer"])

        # Query about CEG Guindy fees
        res2 = self.client.post("/api/chat", json={"message": "What are the fees for CEG Guindy?"})
        self.assertEqual(res2.status_code, 200)
        data2 = res2.get_json()
        self.assertIn("Tuition Fee", data2["answer"])

    def test_09_admin_status(self):
        res = self.client.get("/api/admin/status")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "operational")
        self.assertTrue(data["ml_model_loaded"])

if __name__ == "__main__":
    unittest.main()
