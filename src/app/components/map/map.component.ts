import { Component, EventEmitter, Inject, NgZone, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import mapboxgl from 'mapbox-gl';
import environments from "../../../environments/environment";
import { isPlatformBrowser } from '@angular/common';
import { prices, PriceData, Prices } from './data';
import { MapDepartementService } from '../../services/map-departement.service';
import { DataService } from '../../services/data.service';

interface GeoJSONFeature {
  id: number;
  properties: {
    code: string;
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
export class MapComponent implements OnInit {
  @Output() placeSelected = new EventEmitter<string>();
  @Output() placeSelectedPrice = new EventEmitter<number>();
  @Output() placeSelectedCodeInsee = new EventEmitter<number>();

  map!: mapboxgl.Map;
  lat: number = 46.603354;
  lng: number = 1.888334;
  hoveredFeatureId: number | null = null;
  lastPlace: string = "";

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private http: HttpClient,
    private mapDepartementService: MapDepartementService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    mapboxgl.accessToken = environments.mapbox.accessToken;
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
    this.mapDepartementService.getDepartementPrice().subscribe(price => {
      this.loadRegionData();
      this.loadDepartementData(price);
      this.loadCommuneData(price);
    });
  }

  loadRegionData(): void {
    this.http.get<GeoJSONData>('assets/regions.geojson').subscribe(data => {
      const geojsonData = this.addIdsToGeoJSONData(data, prices['region']);
      this.addSource('region', geojsonData);
      this.addLayer('region-layer', 'region', 'fill', { 'fill-opacity': 0 }, {}, 3, 6.5);
      this.addLayer('region-outline', 'region', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.8], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#008B8B','#FFF'] }, {}, 3, 6.5);
    });
  }

  loadDepartementData(price: Prices): void {
    this.http.get<GeoJSONData>('assets/departements.geojson').subscribe(data => {
      const geojsonData = this.addIdsToGeoJSONData(data, price["departements"]);
      this.addSource('departement', geojsonData);
      const colorExpression = this.generateColorExpression(price["departements"]);
      
      this.addLayer('departement-layer', 'departement', 'fill', { 'fill-color': colorExpression, 'fill-opacity': 0.8 }, {}, 3, 7.2);
      this.addLayer('departement-outline', 'departement', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#008B8B','#FFF'] }, {}, 4, 6.5);
      this.addLayer('departement-outline-zoom', 'departement', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.5], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#008B8B','#FFF'] }, {}, 6.5, 10.5);
      })
  }

  loadCommuneData(price: Prices): void {
    this.http.get<GeoJSONData>('assets/communes.geojson').subscribe(data => {
      const geojsonData = this.addIdsToGeoJSONData(data, price['communes']);
      this.addSource('commune', geojsonData);
      const colorExpression = this.generateColorExpression(price['communes']);

      this.addLayer('commune-layer', 'commune', 'fill', { 'fill-color': colorExpression, 'fill-opacity': 0.7 }, {}, 7.2);
      this.addLayer('commune-outline', 'commune', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#008B8B','#FFF'] }, {}, 7.2, 10.5);
      this.addLayer('commune-outline-zoom', 'commune', 'line', { 'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.5], 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#008B8B','#FFF'] }, {}, 10.5);

      this.map.moveLayer("region-outline", "departement-outline");
      this.map.moveLayer("departement-outline-zoom", "commune-outline");
      this.map.moveLayer("region-layer", "departement-layer");
    });
  }

  addIdsToGeoJSONData(data: GeoJSONData, priceData: PriceData[]): GeoJSONData {
    data.features.forEach((feature, index) => {
      feature.id = index + 1;
      const region = priceData.find(r => r.code === feature.properties.code);
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
    const stops: (string | number)[][] = [];
    const colors = [
        "#004d00",
        "#006600",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#FF5722",
        "#FF8A80",
        "#F44336",
        "#FF5252",
        "#FF3333",
        "#8B0000",
        "#E57373",
        "#EF5350"
    ];

    const priceValues = prices.map((entry: PriceData) => entry.price);
    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);

    const lowerSegmentCount = 9;
    const middleSegmentCount = 5;
    const upperSegmentCount = 1;

    const lowerThreshold = minPrice + (maxPrice - minPrice) * 0.2;
    const middleThreshold = minPrice + (maxPrice - minPrice) * 0.7;
    let lastPrice = minPrice;

    for (let i = 0; i < lowerSegmentCount; i++) {
        const ratio = i / (lowerSegmentCount - 1);
        const price = minPrice + ratio * (lowerThreshold - minPrice);
        stops.push([Math.round(price), colors[i]]);
        if (i + 1 === lowerSegmentCount) lastPrice = price;
    }

    for (let i = 0; i < middleSegmentCount; i++) {
        const ratio = i / (middleSegmentCount - 1);
        const price = lowerThreshold + ratio * (middleThreshold - lowerThreshold);
        stops.push([Math.round(price), colors[lowerSegmentCount + i]]);
        if (i + 1 === middleSegmentCount) lastPrice = price;
    }

    for (let i = 0; i < upperSegmentCount; i++) {
        const ratio = i / (upperSegmentCount - 1);
        const price = middleThreshold + ratio * (maxPrice - middleThreshold);
        stops.push([Math.round(price), colors[lowerSegmentCount + middleSegmentCount + i]]);
    }

    const filteredStops = stops.filter((stop, index) => {
        return index === 0 || stop[0] > stops[index - 1][0];
    });

    return ['interpolate', ['linear'], ['get', 'price'], ...filteredStops.flat()];
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
          return;
        }
  
        if (this.hoveredFeatureId !== null && this.hoveredFeatureId !== feature.id) {
          this.map.setFeatureState(
            { source: this.lastPlace.split('-')[0], id: this.hoveredFeatureId },
            { hover: false }
          );
        }
  
        this.hoveredFeatureId = feature.id as number;
        this.lastPlace = layer.id;
  
        this.map.setFeatureState(
          { source: layer.id.split('-')[0], id: this.hoveredFeatureId },
          { hover: true }
        );
  
        const placeName : string = feature.properties.nom;
        const pricePerSquareMeter : number = feature.properties.price;
        const codeInsee : number = feature.properties.code;
        this.placeSelected.emit(placeName);
        this.placeSelectedPrice.emit(pricePerSquareMeter);
        this.placeSelectedCodeInsee.emit(codeInsee);
        this.dataService.setData(placeName);
      });
    });
  }
  
  
}
