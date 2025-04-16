"""
Modèle Recommendation :
- Représente une recommandation avec les champs suivants :
  - user_id : Identifiant de l'utilisateur associé.
  - content : Contenu de la recommandation.
  - created_at : Date de création.
"""

import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd

class HealthRecommendationModel:
    def __init__(self):
        self.scaler = StandardScaler()
        self.kmeans = KMeans(n_clusters=3, random_state=42)
        self.is_fitted = False
    
    def prepare_data(self, health_data):
        """Prépare les données pour l'analyse"""
        features = []
        for data in health_data:
            features.append([
                data.sleep_duration or 0,
                data.sleep_quality or 5,
                data.exercise_duration or 0,
                data.calories_burned or 0,
                data.calories_consumed or 0,
                data.protein or 0,
                data.carbs or 0,
                data.fat or 0
            ])
        return np.array(features)
    
    def fit(self, health_data):
        """Entraîne le modèle sur les données historiques"""
        X = self.prepare_data(health_data)
        X_scaled = self.scaler.fit_transform(X)
        self.kmeans.fit(X_scaled)
        self.is_fitted = True
    
    def generate_recommendations(self, user_data):
        """Génère des recommandations personnalisées"""
        if not self.is_fitted:
            return self._get_default_recommendations()
        
        X = self.prepare_data([user_data])
        X_scaled = self.scaler.transform(X)
        cluster = self.kmeans.predict(X_scaled)[0]
        
        return self._get_cluster_recommendations(cluster, user_data)
    
    def _get_default_recommendations(self):
        """Recommandations par défaut si le modèle n'est pas entraîné"""
        return {
            'sleep': 'Essayez de dormir 7-8 heures par nuit',
            'exercise': 'Faites au moins 30 minutes d\'exercice par jour',
            'nutrition': 'Maintenez un régime équilibré'
        }
    
    def _get_cluster_recommendations(self, cluster, user_data):
        """Génère des recommandations basées sur le cluster"""
        recommendations = {}
        
        # Recommandations pour le sommeil
        if user_data.sleep_duration < 7:
            recommendations['sleep'] = 'Augmentez votre temps de sommeil à au moins 7 heures'
        elif user_data.sleep_duration > 9:
            recommendations['sleep'] = 'Essayez de réduire votre temps de sommeil à 8-9 heures'
        else:
            recommendations['sleep'] = 'Votre temps de sommeil est optimal'
        
        # Recommandations pour l'exercice
        if user_data.exercise_duration < 30:
            recommendations['exercise'] = 'Augmentez votre temps d\'exercice à au moins 30 minutes par jour'
        else:
            recommendations['exercise'] = 'Continuez votre routine d\'exercice actuelle'
        
        # Recommandations nutritionnelles
        if user_data.calories_consumed > 2500:
            recommendations['nutrition'] = 'Essayez de réduire votre apport calorique'
        elif user_data.calories_consumed < 1500:
            recommendations['nutrition'] = 'Augmentez votre apport calorique'
        else:
            recommendations['nutrition'] = 'Votre apport calorique est équilibré'
        
        return recommendations