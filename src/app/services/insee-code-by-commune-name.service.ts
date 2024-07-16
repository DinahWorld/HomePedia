import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InseeCodeByCommuneNameService {
  private apiUrl = 'https://geo.api.gouv.fr/communes?nom=';

  constructor(private http: HttpClient) {}

  getCommuneInseeCode(communeName: string): Observable<any> {
    const url = `${this.apiUrl}${communeName}&fields=nom,code&format=json&geometry=centre`;
    return this.http.get<any>(url);
  }
}
