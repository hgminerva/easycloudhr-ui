import { TestBed } from '@angular/core/testing';

import { PayrollDetailService } from './payroll-detail.service';

describe('PayrollDetailService', () => {
  let service: PayrollDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
