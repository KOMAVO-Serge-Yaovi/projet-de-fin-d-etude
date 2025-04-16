# Application de Suivi de Santé Personnelle avec IA

Une application web complète pour le suivi de la santé personnelle, intégrant des fonctionnalités d'IA pour des recommandations personnalisées.

## Fonctionnalités principales

- Authentification sécurisée des utilisateurs
- Suivi de l'alimentation, des exercices et du sommeil
- Analyse des données avec IA
- Dashboard interactif
- Recommandations personnalisées

## Technologies utilisées

- Frontend : Angular
- Backend : Flask
- Base de données : MySQL
- IA : Scikit-learn

## Installation

### Prérequis

- Node.js et npm
- Python 3.8+
- MySQL

### Configuration

1. Cloner le repository
2. Installer les dépendances frontend :
```bash
cd frontend
npm install
```

3. Installer les dépendances backend :
```bash
cd backend
pip install -r requirements.txt
```

4. Configurer la base de données MySQL

5. Lancer l'application :
```bash
# Backend
cd backend
python app.py

# Frontend
cd frontend
ng serve
```

## Structure du projet

```
.
├── frontend/           # Application Angular
├── backend/           # API Flask
├── models/           # Modèles d'IA
└── docs/            # Documentation
``` 