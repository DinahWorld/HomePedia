import { TestBed } from '@angular/core/testing';

import { DepartementsPriceM2Service } from './departementspricem2.service';

describe('ApidepartementsService', () => {
  let service: DepartementsPriceM2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartementsPriceM2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
