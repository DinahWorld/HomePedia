import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private placeName: string | null = null;

  constructor() {}

  setData(placeName: string) {
    this.placeName = placeName;
  }

  getData() {
    return this.placeName;
  }
}