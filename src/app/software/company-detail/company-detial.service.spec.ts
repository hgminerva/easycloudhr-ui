import { TestBed } from '@angular/core/testing';

import { CompanyDetialService } from './company-detial.service';

describe('CompanyDetialService', () => {
  let service: CompanyDetialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyDetialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
