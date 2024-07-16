import { AfterViewInit, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import mapboxgl from 'mapbox-gl';
import environments from "../../../environments/environment";
import { isPlatformBrowser } from '@angular/common';
import { prices, PriceData } from './data';

interface GeoJSONFeature {
  id: number;
  properties: {
    nom: string;
    price?: number;
  };
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  map!: mapboxgl.Map;
  lat: number = 46.603354;
  lng: number = 1.888334;
  hoveredFeatureId: number | null = null;
  lastPlace: string = "";

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    mapboxgl.accessToken = environments.mapbox.accessToken;
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('DOMContentLoaded', () => {
        this.zone.runOutsideAngular(() => {
          this.initializeMap();
        });
      });
    }
  }

  initializeMap(): void {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [this.lng, this.lat],
        zoom: 4.5,
      });

      this.map.on('load', () => {
        console.log('Map loaded');
        this.loadGeoJSONData();
        this.addHoverListeners();
      });
    } else {
      console.error('Map container not found');
    }
  }

  loadGeoJSONData(): void {
    this.loadRegionData();
    this.loadDepartementData();
    this.loadCommuneData();
  }

  loadRegionData(): void {
    this.http.get<GeoJSONData>('assets/regions.geojson').subscribe(data => {
      const geojsonData = this.addIdsToGeoJSONData(data, prices['region']);
      this.addSource('region', geojsonData);
      this.addLayer('region-layer', 'region', 'fill', { 'fill-opacity': 0 }, {}, 3, 6.5);
      this.addLayer('region-outline', 'region', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.8], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#00FF00','#FFF'] }, {}, 3, 6.5);
    });
  }

  loadDepartementData(): void {
    this.http.get<GeoJSONData>('assets/departements.geojson').subscribe(data => {
      const geojsonData = this.addIdsToGeoJSONData(data, prices['departement']);
      this.addSource('departement', geojsonData);
      const colorExpression = this.generateColorExpression(prices['departement']);
      this.addLayer('departement-layer', 'departement', 'fill', { 'fill-color': colorExpression, 'fill-opacity': 0.7 }, {}, 3, 7.2);
      this.addLayer('departement-outline', 'departement', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#00FF00','#FFF'] }, {}, 4, 6.5);
      this.addLayer('departement-outline-zoom', 'departement', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.5], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#00FF00','#FFF'] }, {}, 6.5, 10.5);
    });
  }

  loadCommuneData(): void {
    this.http.get<GeoJSONData>('assets/communes.geojson').subscribe(data => {
      const geojsonData = this.addIdsToGeoJSONData(data, prices['commune']);
      this.addSource('commune', geojsonData);
      const colorExpression = this.generateColorExpression(prices['commune']);
      this.addLayer('commune-layer', 'commune', 'fill', { 'fill-color': colorExpression, 'fill-opacity': 0.7 }, {}, 7.2);
      this.addLayer('commune-outline', 'commune', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#00FF00','#FFF'] }, {}, 7.2, 10.5);
      this.addLayer('commune-outline-zoom', 'commune', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.5], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#00FF00','#FFF'] }, {}, 10.5);

      this.map.moveLayer("region-outline", "departement-outline");
      this.map.moveLayer("departement-outline-zoom", "commune-outline");
      this.map.moveLayer("region-layer", "departement-layer");
    });
  }

  addIdsToGeoJSONData(data: GeoJSONData, priceData: PriceData[]): GeoJSONData {
    data.features.forEach((feature, index) => {
      feature.id = index + 1;
      const region = priceData.find(r => r.name === feature.properties.nom);
      if (region) {
        feature.properties.price = region.price;
      }
    });
    return data;
  }

  addPricesToGeoJSONData(data: GeoJSONData, priceData: PriceData[]): GeoJSONData {
    data.features.forEach(feature => {
      const region = priceData.find(r => r.name === feature.properties.nom);
      if (region) {
        feature.properties.price = region.price;
      }
    });
    return data;
  }

  addSource(id: string, data: GeoJSONData): void {
    this.map.addSource(id, {
      type: 'geojson',
      data: data as any
    });
  }

  addLayer(id: string, source: string, type: 'fill' | 'line', paint: any, layout: any = {}, minzoom?: number, maxzoom?: number,): void {
    this.map.addLayer({
      id: id,
      type: type,
      source: source,
      layout: layout,
      paint: paint,
      ...(minzoom !== undefined && { minzoom: minzoom }),
      ...(maxzoom !== undefined && { maxzoom: maxzoom })
    });
  }

  generateColorExpression(prices: PriceData[]): any[] {
    const stops = [];
    const colors = ['#FFFFFF', '#FFCCCC', '#FF9999', '#FF6666', '#FF0000'];

    const priceValues = prices.map((entry: PriceData) => entry.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const step = (maxPrice - minPrice) / (colors.length - 1);

    for (let i = 0; i < colors.length; i++) {
      const price = minPrice + i * step;
      stops.push([price, colors[i]]);
    }

    return ['interpolate', ['linear'], ['get', 'price'], ...stops.flat()];
  }

  addHoverListeners(): void {
    const layers = [
      { id: 'region-layer', minZoom: 3, maxZoom: 6 },
      { id: 'departement-layer', minZoom: 6, maxZoom: 8 },
      { id: 'commune-layer', minZoom: 8, maxZoom: 14 }
    ];
  
    layers.forEach(layer => {
      this.map.on('click', layer.id, (e) => {
        const currentZoom = this.map.getZoom();
        if (currentZoom < layer.minZoom || currentZoom > layer.maxZoom) {
          return;
        }
  
        const feature = e.features && e.features[0];
        if (!feature) {
          // console.log('No feature found at click event');
          return;
        }
  
        // Réinitialisez l'état de la région précédemment sélectionnée
        if (this.hoveredFeatureId !== null && this.hoveredFeatureId !== feature.id) {
          this.map.setFeatureState(
            { source: this.lastPlace.split('-')[0], id: this.hoveredFeatureId },
            { hover: false }
          );
        }
  
        // Conservez l'ID de la région cliquée
        this.hoveredFeatureId = feature.id as number;
        this.lastPlace = layer.id;
  
        this.map.setFeatureState(
          { source: layer.id.split('-')[0], id: this.hoveredFeatureId },
          { hover: true }
        );
  
        // Affichez le nom de la région et le prix au mètre carré
        const regionName = feature.properties.nom;
        const pricePerSquareMeter = feature.properties.price;
        console.log(`${layer.id.split('-')[0]} : ${regionName}, Prix au mètre carré : ${pricePerSquareMeter}`);
      });
    });
  }
  
  
}
