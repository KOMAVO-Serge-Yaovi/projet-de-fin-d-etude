from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from database import db
import logging

logging.basicConfig(level=logging.DEBUG)

auth_bp = Blueprint('auth', __name__)

"""
Routes d'authentification :
- POST /register : Inscription d'un nouvel utilisateur.
- POST /login : Connexion d'un utilisateur existant.
"""

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Vérification des données requises
    if not all(k in data for k in ('email', 'password', 'first_name', 'last_name')):
        return jsonify({'error': 'Données manquantes'}), 400
    
    # Vérification si l'utilisateur existe déjà
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email déjà utilisé'}), 400
    
    # Création du nouvel utilisateur
    user = User(
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Utilisateur créé avec succès'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    logging.debug(f"Données reçues pour la connexion : {data}")

    if not all(k in data for k in ('email', 'password')):
        logging.debug("Données manquantes dans la requête.")
        return jsonify({'error': 'Email et mot de passe requis'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user:
        logging.debug(f"Utilisateur trouvé : {user.email}")
    else:
        logging.debug("Utilisateur non trouvé.")

    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        logging.debug("Connexion réussie.")
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200

    logging.debug("Email ou mot de passe incorrect.")
    return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    return jsonify(user.to_dict()), 200