import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from app import app

import unittest

class TestAuthRoutes(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_register(self):
        response = self.app.post('/api/auth/register', json={
            'email': 'unique_test@example.com',
            'password': 'password123',
            'first_name': 'Unique',
            'last_name': 'User'
        })
        self.assertEqual(response.status_code, 201)

    def test_login(self):
        response = self.app.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
