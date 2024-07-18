import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Election {
  resultat: number[];
}

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private url =
    'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre/records';

  constructor(private http: HttpClient) {}

  private formatLocality(locality: string): string {
    if (!locality) return locality;
    return locality.toUpperCase();
  }

  searchSchoolsByLocation(locality: string): Observable<any> {
    const formattedLocality = this.formatLocality(locality);
    const params = new HttpParams().set('limit', '20').set('refine', `localite_acheminement_uai:"${formattedLocality}"`);

    return this.http.get<Election>(this.url, { params });
  }
}
