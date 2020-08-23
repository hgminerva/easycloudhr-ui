import { TestBed } from '@angular/core/testing';

import { PayrollOtherDeductionDetailService } from './payroll-other-deduction-detail.service';

describe('PayrollOtherDeductionDetailService', () => {
  let service: PayrollOtherDeductionDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollOtherDeductionDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
