import { TestBed } from '@angular/core/testing';

import { OtherDeductionsService } from './other-deductions.service';

describe('OtherDeductionsService', () => {
  let service: OtherDeductionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherDeductionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
