import { TestBed } from '@angular/core/testing';

import { LoanListService } from './loan-list.service';

describe('LoanListService', () => {
  let service: LoanListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
