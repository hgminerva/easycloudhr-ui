import { TestBed } from '@angular/core/testing';

import { PayrollOtherIncomeService } from './payroll-other-income.service';

describe('PayrollOtherIncomeService', () => {
  let service: PayrollOtherIncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollOtherIncomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
