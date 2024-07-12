import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunePriceM2Service {
  constructor(private http: HttpClient) {}

  getCommuneData(communeCodePostal: string): Observable<any> {
    const url = `https://apidf-preprod.cerema.fr/indicateurs/dv3f/communes/annuel/${communeCodePostal}/`;
    return this.http.get<any>(url);
  }
}
