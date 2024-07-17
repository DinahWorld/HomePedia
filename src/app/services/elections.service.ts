import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ElectionsService {
  private url =
    'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/elections-france-presidentielles-2022-2nd-tour-par-bureau-de-vote/records';

  constructor(private http: HttpClient, private utils: UtilsService) {}

  searchElectionDataByCity(locality: string): Observable<any> {
    const formattedLocality = this.utils.formatString(locality);
    const params = new HttpParams().set('refine', `com_name:${formattedLocality}`);

    return this.http.get<any>(this.url, { params });
  }
}
