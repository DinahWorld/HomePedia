import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prices } from '../components/map/data';

@Injectable({
  providedIn: 'root'
})
export class MapDepartementService {

  private url = 'http://localhost:8080/api/v1/departement';

  constructor(private http: HttpClient) {}

  getDepartementGeoJson(locality: string): Observable<any> {
    return this.http.get<any>(this.url + `?departement=${locality}`);
  }

  getDepartementPrice(): Observable<Prices> {
    return this.http.get<any>(this.url + `/price`);
  }
}