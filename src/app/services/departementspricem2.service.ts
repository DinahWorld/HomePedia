import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartementsPriceM2Service {
  constructor(private http: HttpClient) {}

  getDepartementPriceData(departementCode: string): Observable<any> {
    const url = `https://apidf-preprod.cerema.fr/indicateurs/dv3f/departements/annuel/${departementCode}/`;
    return this.http.get<any>(url);
  }
}
