import { TestBed } from '@angular/core/testing';

import { CommunePriceM2Service } from './communepricem2.service';

describe('CommunePriceM2Service', () => {
  let service: CommunePriceM2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunePriceM2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
