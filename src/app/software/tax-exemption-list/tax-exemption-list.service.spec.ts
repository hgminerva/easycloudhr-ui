import { TestBed } from '@angular/core/testing';

import { TaxExemptionListService } from './tax-exemption-list.service';

describe('TaxExemptionListService', () => {
  let service: TaxExemptionListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxExemptionListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
