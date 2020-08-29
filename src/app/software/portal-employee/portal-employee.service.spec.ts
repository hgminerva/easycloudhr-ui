import { TestBed } from '@angular/core/testing';

import { PortalEmployeeService } from './portal-employee.service';

describe('PortalEmployeeService', () => {
  let service: PortalEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortalEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
