import { TestBed } from '@angular/core/testing';

import { RegionPriceM2Service } from './regionspricem2.service';

describe('Regionspricem2Service', () => {
  let service: RegionPriceM2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionPriceM2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
