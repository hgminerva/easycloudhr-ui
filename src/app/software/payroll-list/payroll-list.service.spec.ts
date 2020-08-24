import { TestBed } from '@angular/core/testing';

import { PayrollListService } from './payroll-list.service';

describe('PayrollListService', () => {
  let service: PayrollListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
