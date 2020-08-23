import { TestBed } from '@angular/core/testing';

import { PayrollOtherDeductionListService } from './payroll-other-deduction-list.service';

describe('PayrollOtherDeductionListService', () => {
  let service: PayrollOtherDeductionListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollOtherDeductionListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
