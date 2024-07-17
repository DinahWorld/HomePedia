import requests
import pandas as pd

CEREMA_API_URL = "https://apidf-preprod.cerema.fr/indicateurs/dv3f/communes/annuel/{}/?annee=2023"  # URL avec un emplacement pour le code région
YOUR_API_ENDPOINT = "http://localhost:8080/api/v1/communes"  # Remplacez par votre URL réelle

with open('1001.txt', 'r') as fichier:
    lignes = fichier.readlines()

# Supprimer les espaces et les nouvelles lignes, et convertir chaque nombre en chaîne
array_de_strings = [ligne.strip() for ligne in lignes]

# Lire le fichier CSV
df = pd.read_csv('data.csv')

# Filtrer les colonnes nécessaires
df_filtered = df[['INSEE_COM', 'Prixm2Moyen']]

for index, row in df_filtered.iterrows():
    insee_com = row['INSEE_COM']
    prix_m2_moyen = row['Prixm2Moyen']
    
    try:
        response = requests.post(f"{YOUR_API_ENDPOINT}?price={prix_m2_moyen}&code={insee_com}", timeout=1)
        response.raise_for_status()
        print(f"Prix mis à jour pour la commune {insee_com} : {prix_m2_moyen} €")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de la mise à jour du prix pour la commune {insee_com} : {e}")

