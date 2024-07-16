export interface PriceData {
    name: string;
    price: number;
}
  
export interface Prices {
    [key: string]: PriceData[];
}

export const prices: Prices = {
    "region": [
        {name: "Auvergne-Rhône-Alpes", price: 2500},
        {name: "Île-de-France", price: 5500},
        {name: "Nouvelle-Aquitaine", price: 2200},
        {name: "Provence-Alpes-Côte d'Azur", price: 4800},
        {name: "Occitanie", price: 2300},
        {name: "Hauts-de-France", price: 1800},
        {name: "Bretagne", price: 2700},
        {name: "Grand Est", price: 2000},
        {name: "Normandie", price: 2100},
        {name: "Bourgogne-Franche-Comté", price: 1900},
        {name: "Centre-Val de Loire", price: 2400},
        {name: "Pays de la Loire", price: 2500},
        {name: "Corse", price: 3000}
    ],
    "departement": [
        {name: "Rhône", price: 3000},
        {name: "Paris", price: 9000},
        {name: "Gironde", price: 2800},
        {name: "Alpes-Maritimes", price: 5200},
        {name: "Haute-Garonne", price: 2500},
        {name: "Nord", price: 1900},
        {name: "Ille-et-Vilaine", price: 2900},
        {name: "Bas-Rhin", price: 2200},
        {name: "Seine-Maritime", price: 2100},
        {name: "Côte-d'Or", price: 2000},
        {name: "Loiret", price: 2300},
        {name: "Loire-Atlantique", price: 2700},
        {name: "Corse-du-Sud", price: 3200}
    ],
    "commune": [
        {name: "Lyon", price: 3500},
        {name: "Paris", price: 9500},
        {name: "Bordeaux", price: 3200},
        {name: "Nice", price: 5600},
        {name: "Toulouse", price: 2900},
        {name: "Lille", price: 2000},
        {name: "Rennes", price: 3100},
        {name: "Strasbourg", price: 2400},
        {name: "Le Havre", price: 2200},
        {name: "Dijon", price: 2100},
        {name: "Orléans", price: 2500},
        {name: "Nantes", price: 2900},
        {name: "Ajaccio", price: 3500}
    ]
}
