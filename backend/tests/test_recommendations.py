import unittest
from app import app

class TestRecommendationRoutes(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_get_recommendations(self):
        response = self.app.get('/api/recommendations')
        self.assertEqual(response.status_code, 200)

    def test_add_recommendation(self):
        response = self.app.post('/api/recommendations', json={
            'user_id': 1,
            'content': 'Drink more water',
        })
        self.assertEqual(response.status_code, 201)

if __name__ == '__main__':
    unittest.main()
