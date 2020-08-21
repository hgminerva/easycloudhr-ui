import { TestBed } from '@angular/core/testing';

import { PayrollOtherIncomeDetailService } from './payroll-other-income-detail.service';

describe('PayrollOtherIncomeDetailService', () => {
  let service: PayrollOtherIncomeDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollOtherIncomeDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
