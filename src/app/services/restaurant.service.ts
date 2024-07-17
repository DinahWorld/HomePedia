import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private url = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/osm-france-food-service/records';

  constructor(private http: HttpClient, private utils: UtilsService) {}

  searchFoodServicesByLocation(locality: string): Observable<any> {
    const formattedLocality = this.utils.formatString(locality);
    const params = new HttpParams().set('refine', `meta_name_com:${formattedLocality}`);

    return this.http.get<any>(this.url, { params });
  }
}
