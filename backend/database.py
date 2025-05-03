from flask_sqlalchemy import SQLAlchemy
from os import getenv
from dotenv import load_dotenv

# Chargement des variables d'environnement
load_dotenv()

# Initialisation de l'instance SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Initialise la connexion à la base de données"""
    # Configuration de la base de données
    app.config['SQLALCHEMY_DATABASE_URI'] = getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialisation de la base de données avec l'application
    db.init_app(app)
    
    # Création de toutes les tables
    with app.app_context():
        db.create_all()
        
def get_db():
    """Retourne l'instance de la base de données"""
    return db

def close_db(e=None):
    """Ferme la connexion à la base de données"""
    db.session.remove()