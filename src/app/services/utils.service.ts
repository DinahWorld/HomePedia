import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  formatString(locality: string): string {
    if (!locality) return locality;
    return locality.charAt(0).toUpperCase() + locality.slice(1).toLowerCase();
  }
}
