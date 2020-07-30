import { TestBed } from '@angular/core/testing';

import { ShiftCodeDetailService } from './shift-code-detail.service';

describe('ShiftCodeDetailService', () => {
  let service: ShiftCodeDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftCodeDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
