import unittest
from app import app

class TestHealthDataRoutes(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_get_health_data(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)

    def test_add_health_data(self):
        response = self.app.post('/api/health', json={
            'user_id': 1,
            'date': '2025-04-15',
            'sleep_duration': 8,
            'exercise_duration': 1,
            'calories_burned': 500
        })
        self.assertEqual(response.status_code, 201)

if __name__ == '__main__':
    unittest.main()
