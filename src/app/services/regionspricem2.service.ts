import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionPriceM2Service {
  constructor(private http: HttpClient) {}

  getRegionPriceData(regionCode: string): Observable<any> {
    const url = `https://apidf-preprod.cerema.fr/indicateurs/dv3f/regions/annuel/${regionCode}/`;
    return this.http.get<any>(url);
  }
}
