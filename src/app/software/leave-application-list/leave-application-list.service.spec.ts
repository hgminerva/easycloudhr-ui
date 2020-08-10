import { TestBed } from '@angular/core/testing';

import { LeaveApplicationListService } from './leave-application-list.service';

describe('LeaveApplicationListService', () => {
  let service: LeaveApplicationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveApplicationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
