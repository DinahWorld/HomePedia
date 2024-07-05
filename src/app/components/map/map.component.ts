import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import environments from "../../../environments/environment";


@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  map!: mapboxgl.Map;
  lat: number = 46.603354;
  lng: number = 1.888334;

  ngOnInit() : void {
    (mapboxgl as typeof mapboxgl).accessToken = environments.mapbox.accessToken;
    this.map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [this.lng, this.lat], // starting position [lng, lat]
    zoom: 5, // starting zoom
  });
  }
}
