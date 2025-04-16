from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from dotenv import load_dotenv
from database import db
from flask_ngrok import run_with_ngrok  # Ajout de cette ligne
from flask_caching import Cache

# Chargement des variables d'environnement
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
run_with_ngrok(app)  # Ajouter cette ligne avant app.run()

# Configuration de la base de données pour Colab
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health_tracker.db'
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

# Enregistrement des blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(health_data_bp, url_prefix='/api/health')
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')

@app.route('/')
def index():
    return jsonify({"message": "Bienvenue sur l'API de suivi de santé"})

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
    # Configuration pour Colab
    app.run(host='0.0.0.0', port=5000)