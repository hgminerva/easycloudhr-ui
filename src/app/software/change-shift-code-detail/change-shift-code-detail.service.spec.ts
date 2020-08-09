import { TestBed } from '@angular/core/testing';

import { ChangeShiftCodeDetailService } from './change-shift-code-detail.service';

describe('ChangeShiftCodeDetailService', () => {
  let service: ChangeShiftCodeDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeShiftCodeDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
