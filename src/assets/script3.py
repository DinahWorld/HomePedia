import requests

CEREMA_API_URL = "https://apidf-preprod.cerema.fr/indicateurs/dv3f/communes/annuel/{}/?annee=2023"  # URL avec un emplacement pour le code région
YOUR_API_ENDPOINT = "http://localhost:8080/api/v1/communes"  # Remplacez par votre URL réelle

with open('1001.txt', 'r') as fichier:
    lignes = fichier.readlines()

# Supprimer les espaces et les nouvelles lignes, et convertir chaque nombre en chaîne
array_de_strings = [ligne.strip() for ligne in lignes]


# Liste des codes région (à compléter avec tous les codes région de France)
CODES_REGION = [
"95",
"94",
"93",
"92",
"91",
"90",
"89",
"88",
"87",
"86",
"85",
"84",
"83",
"82",
"81",
"80",
"79",
"78",
"77",
"76",
"75",
"74",
"73",
"72",
"70",
"69",
"68",
"67",
"65",
"63",
"60",
"59",
"58",
"57",
"56",
"54",
"52",
"51",
"50",
"49",
"48",
"47",
"46",
"45",
"44",
"43",
"42",
"41",
"40",
"39",
"38",
"37",
"36",
"35",
"34",
"33",
"32",
"31",
"30",
"2B",
"2A",
"29",
"28",
"27",
"25",
"24",
"23",
"22",
"21",
"19",
"18",
"17",
"16",
"15",
"14",
"13",
"12",
"11",
"10",
"09",
"08",
"07",
"06",
"05",
"04",
"03",
"01"]

def fetch_region_data(code_reg):
    code_reg = "0" + code_reg
    url = CEREMA_API_URL.format(code_reg)
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])[0]
    except (requests.exceptions.RequestException, IndexError) as e:
        print(f"Erreur lors de la récupération des données pour la région {code_reg} : {e}")
        return {}

def update_region_price_maison(code_reg, price_key):
    price_maison = region_data.get("pxm2_median_mmx")
    price_appart = region_data.get("pxm2_median_cod111")
    price = price_maison
    name = region_data.get("libgeo")
    
    if price and name is not None:
        try:
            response = requests.post(f"{YOUR_API_ENDPOINT}?priceMaison={price}&priceAppart={price}&name={name}")
            response.raise_for_status()
            print(f"Prix mis à jour pour la région {code_reg} : {price} €")
        except requests.exceptions.RequestException as e:
            print(f"Erreur lors de la mise à jour du prix pour la région {name} : {e}")
    else:
        print(f"Pas de prix trouvé pour la clé {price_key} dans la région {name}")


def main():
    for code_reg in array_de_strings:
        global region_data
        region_data = fetch_region_data(code_reg)
        if region_data:
            # Mettre à jour les prix pour les appartements et les maisons
            update_region_price_maison(code_reg, "pxm2_median_mmx")

if __name__ == "__main__":
    main()