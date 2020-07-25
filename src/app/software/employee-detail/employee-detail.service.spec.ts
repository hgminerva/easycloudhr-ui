import { TestBed } from '@angular/core/testing';

import { EmployeeDetailService } from './employee-detail.service';

describe('EmployeeDetailService', () => {
  let service: EmployeeDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
