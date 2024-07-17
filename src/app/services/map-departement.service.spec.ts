import { TestBed } from '@angular/core/testing';

import { MapDepartementService } from './map-departement.service';

describe('MapDepartementService', () => {
  let service: MapDepartementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapDepartementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
