from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.health_data import HealthData
from app import db
from datetime import datetime
from flask_caching import Cache

health_data_bp = Blueprint('health_data', __name__)
cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

"""
Routes des données de santé :
- GET /health_data : Récupérer les données de santé.
- POST /health_data : Ajouter de nouvelles données de santé.
- PUT /health_data/<id> : Mettre à jour des données de santé existantes.
- DELETE /health_data/<id> : Supprimer des données de santé.
"""

@health_data_bp.route('/', methods=['POST'])
@jwt_required()
def add_health_data():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Création d'une nouvelle entrée de données de santé
    health_data = HealthData(
        user_id=user_id,
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
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
    
    try:
        db.session.add(health_data)
        db.session.commit()
        return jsonify(health_data.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@health_data_bp.route('/', methods=['GET'])
@jwt_required()
def get_health_data():
    user_id = get_jwt_identity()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = HealthData.query.filter_by(user_id=user_id)
    
    if start_date:
        query = query.filter(HealthData.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        query = query.filter(HealthData.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    health_data = query.order_by(HealthData.date.desc()).all()
    return jsonify([data.to_dict() for data in health_data]), 200

@health_data_bp.route('/<int:data_id>', methods=['PUT'])
@jwt_required()
def update_health_data(data_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    health_data = HealthData.query.filter_by(id=data_id, user_id=user_id).first()
    if not health_data:
        return jsonify({'error': 'Données non trouvées'}), 404
    
    # Mise à jour des champs
    for key, value in data.items():
        if hasattr(health_data, key):
            setattr(health_data, key, value)
    
    try:
        db.session.commit()
        return jsonify(health_data.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@health_data_bp.route('/<int:data_id>', methods=['DELETE'])
@jwt_required()
def delete_health_data(data_id):
    user_id = get_jwt_identity()
    
    health_data = HealthData.query.filter_by(id=data_id, user_id=user_id).first()
    if not health_data:
        return jsonify({'error': 'Données non trouvées'}), 404
    
    try:
        db.session.delete(health_data)
        db.session.commit()
        return jsonify({'message': 'Données supprimées avec succès'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@health_data_bp.route('/cached', methods=['GET'])
@jwt_required()
@cache.cached(timeout=60, query_string=True)
def get_cached_health_data():
    user_id = get_jwt_identity()
    health_data = HealthData.query.filter_by(user_id=user_id).all()
    return jsonify([data.to_dict() for data in health_data]), 200

@health_data_bp.route('/statistics', methods=['GET'])
@jwt_required()
def get_statistics():
    user_id = get_jwt_identity()
    total_sleep = db.session.query(db.func.sum(HealthData.sleep_duration)).filter_by(user_id=user_id).scalar()
    total_exercise = db.session.query(db.func.sum(HealthData.exercise_duration)).filter_by(user_id=user_id).scalar()
    return jsonify({
        'total_sleep': total_sleep or 0,
        'total_exercise': total_exercise or 0
    }), 200