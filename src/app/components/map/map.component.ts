import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import environments from "../../../environments/environment";
import { CommunePriceM2Service } from "../../services/communepricem2.service";
import { DepartementsPriceM2Service } from "../../services/departementspricem2.service";
import { RegionPriceM2Service } from "../../services/regionspricem2.service";

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map!: mapboxgl.Map;
  lat: number = 46.603354;
  lng: number = 1.888334;
  marker: mapboxgl.Marker | null = null;

  constructor(
    private communePriceM2Service: CommunePriceM2Service,
    private departementsPriceM2Service: DepartementsPriceM2Service,
    private regionPriceM2Service: RegionPriceM2Service
  ) {}

  ngOnInit(): void {
    (mapboxgl as typeof mapboxgl).accessToken = environments.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.lng, this.lat], // starting position [lng, lat]
      zoom: 5, // starting zoom
    });

    this.map.on('load', () => {
      this.addTileset();
      this.addClickListener();
    });
  }

  addTileset(): void {
    const tilesetIdRegion = 'coco2000.cly8nq9vu67si1npi4gfntgpc-2122u';
    const tilesetIdCommune = "coco2000.483n6nsu";
    const tilesetIdDepartement = "coco2000.cly8tsu9eqedt1mp8ukw6vb98-3ctsw";

    this.map.addSource('region', {
      'type': 'vector',
      'url': `mapbox://${tilesetIdRegion}`
    });
    this.map.addSource('commune', {
      'type': 'vector',
      'url': `mapbox://${tilesetIdCommune}`
    });
    this.map.addSource('departement', {
      'type': 'vector',
      'url': `mapbox://${tilesetIdDepartement}`
    });

    this.map.addLayer({
      'id': 'region-layer',
      'type': 'fill',
      'source': 'region',
      'source-layer': 'test',
      'layout': {},
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.2
      },
      'maxzoom': 7
    });

    this.map.addLayer({
      'id': 'region-outline',
      'type': 'line',
      'source': 'region',
      'source-layer': 'test',
      'layout': {},
      'paint': {
        'line-color': '#088',
        'line-width': 1.2
      },
      'maxzoom': 7
    });

    this.map.addLayer({
      'id': 'departement-layer',
      'type': 'fill',
      'source': 'departement',
      'source-layer': 'departement',
      'layout': {},
      'paint': {
        'fill-color': '#088',
        'fill-opacity': 0.4
      },
      'minzoom': 7, // Afficher ce calque à partir d'un zoom de 6
      'maxzoom': 12
    });

    this.map.addLayer({
      'id': 'department-outline',
      'type': 'line',
      'source': 'departement',
      'source-layer': 'departement', // Remplacez par le nom de votre couche source
      'layout': {},
      'paint': {
        'line-color': '#088',
        'line-width': 1.5
      },
      'minzoom': 7, // Afficher ce calque à partir d'un zoom de 6
      'maxzoom': 11 // Afficher ce calque jusqu'à un zoom de 10
    });

    this.map.addLayer({
      'id': 'commune-layer',
      'type': 'fill',
      'source': 'commune',
      'source-layer': 'communes-5e3qyf',
      'layout': {},
      'paint': {
        'fill-color': '#e00',
        'fill-opacity': 0.3
      },
      'minzoom': 11
    });

    this.map.addLayer({
      'id': 'commune-outline',
      'type': 'line',
      'source': 'commune',
      'source-layer': 'communes-5e3qyf',
      'layout': {},
      'paint': {
        'line-color': '#e00',
        'line-width': 1.5
      },
      'minzoom': 11
    });
  }

  addClickListener(): void {
    this.map.on('click', 'commune-layer', (e) => {
      const feature = e.features[0];
      const communeName = feature.properties.nom;
      const communeCodePostal = feature.properties.code;
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      // Supprimer le marqueur précédent s'il existe
      if (this.marker) {
        this.marker.remove();
      }

      // Créer un nouveau marqueur à l'endroit où l'utilisateur a cliqué
      this.marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(this.map);

      // Appel API pour récupérer les données de la commune
      this.communePriceM2Service.getCommuneData(communeCodePostal).subscribe((data: { results: any[]; }) => {
        const results2022 = data.results.find(result => result.annee === '2022');
        if (results2022) {
          const pxm2Median = results2022.pxm2_median_cod111;
          console.log(`Prix médian par m² (2022) pour la commune ${communeName} (${communeCodePostal}): ${pxm2Median} €`);
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`<h3>${communeName}</h3><p>Prix médian par m² (2022): ${pxm2Median} €</p>`)
            .addTo(this.map);
        } else {
          console.log(`Pas de données disponibles pour 2022 pour la commune ${communeName} (${communeCodePostal}).`);
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`<h3>${communeName}</h3><p>Pas de données disponibles pour 2022.</p>`)
            .addTo(this.map);
        }
      });
    });

    this.map.on('click', 'departement-layer', (e) => {
      const feature = e.features[0];
      const departmentName = feature.properties.nom;
      const departmentCode = feature.properties.code;
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      // Supprimer le marqueur précédent s'il existe
      if (this.marker) {
        this.marker.remove();
      }

      // Créer un nouveau marqueur à l'endroit où l'utilisateur a cliqué
      this.marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(this.map);

      // Appel API pour récupérer les données du département
      this.departementsPriceM2Service.getDepartementPriceData(departmentCode).subscribe((data: { results: any[]; }) => {
        const results2022 = data.results.find(result => result.annee === '2022');
        if (results2022) {
          const pxm2Median = results2022.pxm2_median_cod111;
          console.log(`Prix médian par m² (2022) pour le département ${departmentName} (${departmentCode}): ${pxm2Median} €`);
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`<h3>${departmentName}</h3><p>Prix médian par m² (2022): ${pxm2Median} €</p>`)
            .addTo(this.map);
        } else {
          console.log(`Pas de données disponibles pour 2022 pour le département ${departmentName} (${departmentCode}).`);
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`<h3>${departmentName}</h3><p>Pas de données disponibles pour 2022.</p>`)
            .addTo(this.map);
        }
      });
    });

    this.map.on('click', 'region-layer', (e) => {
      const feature = e.features[0];
      const regionName = feature.properties.nom;
      const regionCode = feature.properties.code;
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      // Supprimer le marqueur précédent s'il existe
      if (this.marker) {
        this.marker.remove();
      }

      // Créer un nouveau marqueur à l'endroit où l'utilisateur a cliqué
      this.marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(this.map);

      // Appel API pour récupérer les données de la région
      this.regionPriceM2Service.getRegionPriceData(regionCode).subscribe((data: { results: any[]; }) => {
        const results2022 = data.results.find(result => result.annee === '2022');
        if (results2022) {
          const pxm2Median = results2022.pxm2_median_cod111;
          console.log(`Prix médian par m² (2022) pour la région ${regionName} (${regionCode}): ${pxm2Median} €`);
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`<h3>${regionName}</h3><p>Prix médian par m² (2022): ${pxm2Median} €</p>`)
            .addTo(this.map);
        } else {
          console.log(`Pas de données disponibles pour 2022 pour la région ${regionName} (${regionCode}).`);
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(`<h3>${regionName}</h3><p>Pas de données disponibles pour 2022.</p>`)
            .addTo(this.map);
        }
      });
    });
  }
}