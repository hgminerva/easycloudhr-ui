import { TestBed } from '@angular/core/testing';

import { ShiftCodeListService } from './shift-code-list.service';

describe('ShiftCodeListService', () => {
  let service: ShiftCodeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftCodeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
