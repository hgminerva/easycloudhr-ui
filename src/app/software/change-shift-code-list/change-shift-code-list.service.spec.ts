import { TestBed } from '@angular/core/testing';

import { ChangeShiftCodeListService } from './change-shift-code-list.service';

describe('ChangeShiftCodeListService', () => {
  let service: ChangeShiftCodeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeShiftCodeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
