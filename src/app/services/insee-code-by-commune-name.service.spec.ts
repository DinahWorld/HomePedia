import { TestBed } from '@angular/core/testing';

import { InseeCodeByCommuneNameService } from './insee-code-by-commune-name.service';

describe('InseeCodeByCommuneNameService', () => {
  let service: InseeCodeByCommuneNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InseeCodeByCommuneNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
