import requests
import json

# Fonction pour lire les villes depuis un fichier texte
def read_cities_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        cities = [line.strip() for line in file]
    return cities

# Fonction pour obtenir les données de la ville depuis l'API
def get_city_data(city_name):
    url = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/elections-france-presidentielles-2022-2nd-tour-par-bureau-de-vote/records'
    params = {
        'refine': 'com_name:'+city_name
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve data for {city_name}: {response.status_code}")
        return None

# Fonction pour créer un objet ElectionDTO à partir des informations de la ville
def create_election_dto(city_data):
    for election in city_data["results"]:
        election_dto = {
            "city": election.get("com_name" , ''),
            "postalCode": election.get("com_code" , ''),
            "personName": election.get("nom" , ''),
            "personFullName": election.get("prenom" , ''),
            "vote": election.get("voix" , ''),
        }
        send_to_api(election_dto, "http://localhost:8080/api/v1/election")
    else:
        return None

# Fonction pour envoyer les données à l'API Spring Boot
def send_to_api(election_dto, api_url):
    headers = {'Content-Type': 'application/json'}
    response = requests.post(api_url, data=json.dumps(election_dto), headers=headers)
    print(response)
    return response

# Chemin du fichier texte et URL de l'API
file_path = 'villes.txt'
api_url = 'http://localhost:8080/api/election'

# Lire les villes depuis le fichier texte
cities = read_cities_from_file(file_path)

# Traiter chaque ville
for city in cities:
    city_data = get_city_data(city)
    if city_data:
        election_dto = create_election_dto(city_data)
        if election_dto:
            response = send_to_api(election_dto, api_url)

# Afficher un message de fin
print("Toutes les villes ont été traitées.")
