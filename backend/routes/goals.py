from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.health_data import HealthData
from database import db
from datetime import datetime

goals_bp = Blueprint('goals', __name__)

@goals_bp.route('/', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = HealthData.query.filter_by(user_id=user_id)
    
    if start_date:
        query = query.filter(HealthData.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        query = query.filter(HealthData.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    goals = query.order_by(HealthData.date.desc()).all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goals_bp.route('/', methods=['POST'])
@jwt_required()
def add_goal():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'description', 'category', 'date']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400
    
    try:
        goal = HealthData(
            user_id=user_id,
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            title=data['title'],
            description=data['description'],
            category=data['category'],
            target_value=data.get('targetValue'),
            current_value=data.get('currentValue', 0)
        )
        
        db.session.add(goal)
        db.session.commit()
        return jsonify(goal.to_dict()), 201
        
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@goals_bp.route('/<int:goal_id>', methods=['PUT'])
@jwt_required()
def update_goal(goal_id):
    user_id = get_jwt_identity()
    goal = HealthData.query.filter_by(id=goal_id, user_id=user_id).first()
    
    if not goal:
        return jsonify({'error': 'Goal not found'}), 404
        
    data = request.get_json()
    
    try:
        for key, value in data.items():
            if hasattr(goal, key):
                setattr(goal, key, value)
                
        db.session.commit()
        return jsonify(goal.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@goals_bp.route('/<int:goal_id>', methods=['DELETE'])
@jwt_required()
def delete_goal(goal_id):
    user_id = get_jwt_identity()
    goal = HealthData.query.filter_by(id=goal_id, user_id=user_id).first()
    
    if not goal:
        return jsonify({'error': 'Goal not found'}), 404
        
    try:
        db.session.delete(goal)
        db.session.commit()
        return jsonify({'message': 'Goal deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
