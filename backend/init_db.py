import mysql.connector
import os
from os import getenv
from dotenv import load_dotenv

def init_database():
    # Chargement des variables d'environnement
    load_dotenv()
    
    # Extraction des informations de connexion depuis DATABASE_URL
    db_url = getenv('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL non définie dans le fichier .env")
    
    # Parsing de l'URL de la base de données
    # Format attendu: mysql://user:password@host/dbname
    parts = db_url.replace('mysql://', '').split('@')
    user_pass = parts[0].split(':')
    host_db = parts[1].split('/')
    
    config = {
        'user': user_pass[0],
        'password': user_pass[1],
        'host': host_db[0],
        'database': host_db[1] if len(host_db) > 1 else None
    }
    
    try:
        # Première connexion sans spécifier la base de données
        conn = mysql.connector.connect(
            user=config['user'],
            password=config['password'],
            host=config['host']
        )
        cursor = conn.cursor()
        
        print("Connexion à MySQL établie...")
        
        # Lecture et exécution du fichier schema.sql
        script_dir = os.path.dirname(os.path.abspath(__file__))
        schema_path = os.path.join(script_dir, 'schema.sql')
        with open(schema_path, 'r') as file:
            sql_commands = file.read()
            
            # Exécution de chaque commande SQL
            for command in sql_commands.split(';'):
                if command.strip():
                    cursor.execute(command.strip() + ';')
            
            conn.commit()
            print("Base de données et tables créées avec succès!")
            
    except mysql.connector.Error as err:
        print(f"Erreur lors de l'initialisation de la base de données: {err}")
        raise
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    init_database()