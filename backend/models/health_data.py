"""
Modèle HealthData :
- Représente les données de santé avec les champs suivants :
  - user_id : Identifiant de l'utilisateur associé.
  - date : Date des données de santé.
  - sleep_duration : Durée du sommeil.
  - exercise_duration : Durée de l'exercice.
  - calories_burned : Calories brûlées.
"""

from database import db
from datetime import datetime

class HealthData(db.Model):
    __tablename__ = 'health_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    # Métadonnées de l'objectif
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    
    # Données de sommeil
    sleep_duration = db.Column(db.Float)  # en heures
    sleep_quality = db.Column(db.Integer)  # 1-10
    
    # Données d'exercice
    exercise_duration = db.Column(db.Float)  # en minutes
    exercise_type = db.Column(db.String(50))
    calories_burned = db.Column(db.Float)
    
    # Données alimentaires
    calories_consumed = db.Column(db.Float)
    protein = db.Column(db.Float)  # en grammes
    carbs = db.Column(db.Float)    # en grammes
    fat = db.Column(db.Float)      # en grammes
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat(),
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'sleep_duration': self.sleep_duration,
            'sleep_quality': self.sleep_quality,
            'exercise_duration': self.exercise_duration,
            'exercise_type': self.exercise_type,
            'calories_burned': self.calories_burned,
            'calories_consumed': self.calories_consumed,
            'protein': self.protein,
            'carbs': self.carbs,
            'fat': self.fat,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }