import { TestBed } from '@angular/core/testing';

import { OvertimeApplicationDetailService } from './overtime-application-detail.service';

describe('OvertimeApplicationDetailService', () => {
  let service: OvertimeApplicationDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimeApplicationDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
