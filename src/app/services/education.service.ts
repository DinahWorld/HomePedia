import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private url =
    'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre/records';

  constructor(private http: HttpClient) {}

  searchSchoolsByLocation(locality: string): Observable<any> {
    const params = new HttpParams().set('limit', '20').set('refine', `localite_acheminement_uai:"${locality}"`);

    return this.http.get<any>(this.url, { params });
  }
}
