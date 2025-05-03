from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from dotenv import load_dotenv
from database import db
from flask_ngrok import run_with_ngrok
from flask_caching import Cache

# Chargement des variables d'environnement
load_dotenv()

app = Flask(__name__)
CORS(app,
     resources={r"/api/*": {
         "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         "allow_headers": ["Content-Type", "Authorization", "X-Auth-Token", "Origin", "Accept", "X-Requested-With"],
         "expose_headers": ["Content-Type", "Authorization", "X-Auth-Token"],
         "supports_credentials": True,
         "max_age": 3600
     }},
     supports_credentials=True)

@app.route('/api/auth/', methods=['OPTIONS'])
def handle_auth_options():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Add OPTIONS route handlers for preflight requests
@app.route('/api/health_data/', methods=['OPTIONS'])
def handle_health_data_options():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Auth-Token,Origin,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/health_data/<int:data_id>', methods=['OPTIONS'])
def handle_health_data_item_options(data_id):
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Auth-Token,Origin,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/goals/', methods=['OPTIONS'])
def handle_goals_options():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Auth-Token,Origin,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/goals/<int:goal_id>', methods=['OPTIONS'])
def handle_goals_item_options(goal_id):
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Auth-Token,Origin,Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Configuration de la base de données pour Colab
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'votre_cle_secrete')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialisation des extensions
db.init_app(app)
jwt = JWTManager(app)

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})
cache.init_app(app)

# Import des routes
from routes.auth import auth_bp
from routes.health_data import health_data_bp
from routes.recommendations import recommendations_bp
from routes.goals import goals_bp
from routes.profile import profile_bp

@app.route('/')
def index():
    return jsonify({"message": "Bienvenue sur l'API de suivi de santé"})

# Enregistrement des blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(health_data_bp, url_prefix='/api/health_data')
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
app.register_blueprint(goals_bp, url_prefix='/api/goals')
app.register_blueprint(profile_bp, url_prefix='/api')

# Route supprimée car gérée par le blueprint profile_bp

@app.errorhandler(400)
def handle_bad_request(e):
    return {"error": "Requête invalide"}, 400

@app.errorhandler(401)
def handle_unauthorized(e):
    return {"error": "Non autorisé"}, 401

@app.errorhandler(500)
def handle_server_error(e):
    return {"error": "Erreur interne du serveur"}, 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=5000,
        debug=True
    )
