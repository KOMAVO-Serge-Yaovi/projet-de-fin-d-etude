from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.health_data import HealthData
from models.recommendation_model import HealthRecommendationModel
from app import db

recommendations_bp = Blueprint('recommendations', __name__)
recommendation_model = HealthRecommendationModel()

"""
Routes des recommandations :
- GET /recommendations : Récupérer les recommandations basées sur les données de santé.
- POST /recommendations : Générer de nouvelles recommandations.
"""

@recommendations_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_recommendations():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Création d'un objet HealthData temporaire pour les recommandations
    health_data = HealthData(
        user_id=user_id,
        sleep_duration=data.get('sleep_duration'),
        sleep_quality=data.get('sleep_quality'),
        exercise_duration=data.get('exercise_duration'),
        exercise_type=data.get('exercise_type'),
        calories_burned=data.get('calories_burned'),
        calories_consumed=data.get('calories_consumed'),
        protein=data.get('protein'),
        carbs=data.get('carbs'),
        fat=data.get('fat')
    )
    
    # Génération des recommandations
    recommendations = recommendation_model.generate_recommendations(health_data)
    
    return jsonify(recommendations), 200

@recommendations_bp.route('/train', methods=['POST'])
@jwt_required()
def train_model():
    user_id = get_jwt_identity()
    
    # Récupération des données historiques de l'utilisateur
    historical_data = HealthData.query.filter_by(user_id=user_id).all()
    
    if not historical_data:
        return jsonify({'error': 'Pas assez de données pour l\'entraînement'}), 400
    
    # Entraînement du modèle
    recommendation_model.fit(historical_data)
    
    return jsonify({'message': 'Modèle entraîné avec succès'}), 200