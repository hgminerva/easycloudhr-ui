import { TestBed } from '@angular/core/testing';

import { TaxExemptionDetailService } from './tax-exemption-detail.service';

describe('TaxExemptionDetailService', () => {
  let service: TaxExemptionDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxExemptionDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
