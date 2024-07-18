import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ElectionsService {
  private url =
    'http://localhost:8080/api/v1/election/search?city=';

  constructor(private http: HttpClient, private utils: UtilsService) {}

  searchElectionDataByCity(locality: string): Observable<any> {
    console.log("test election: ",locality)
    return this.http.get<any>(this.url +`${locality}`);
  }
}
