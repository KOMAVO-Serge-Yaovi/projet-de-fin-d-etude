from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.user import User

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
        
    return jsonify(user.to_dict()), 200

@profile_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
        
    try:
        if not request.is_json:
            return jsonify({"error": "Le contenu doit être en JSON"}), 422

        data = request.json
        if not data:
            return jsonify({"error": "Données manquantes"}), 422

        # Validation des types de données
        if 'height' in data and not isinstance(data['height'], (int, float)):
            return jsonify({"error": "La taille doit être un nombre"}), 422
        if 'weight' in data and not isinstance(data['weight'], (int, float)):
            return jsonify({"error": "Le poids doit être un nombre"}), 422
        
        # Conversion de la date si présente
        if 'birth_date' in data:
            try:
                data['birth_date'] = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Format de date invalide (YYYY-MM-DD requis)"}), 422

        # Validation du genre
        if 'gender' in data and data['gender'] not in ['male', 'female', 'other']:
            return jsonify({"error": "Genre invalide"}), 422

        # Mise à jour des champs autorisés
        allowed_fields = ['first_name', 'last_name', 'phone', 'birth_date', 'gender', 'height', 'weight']
        
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
                
        db.session.commit()
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 422