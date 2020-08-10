import { TestBed } from '@angular/core/testing';

import { LeaveApplicationDetailService } from './leave-application-detail.service';

describe('LeaveApplicationDetailService', () => {
  let service: LeaveApplicationDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveApplicationDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
