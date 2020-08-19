import { TestBed } from '@angular/core/testing';

import { OtherIncomeService } from './other-income.service';

describe('OtherIncomeService', () => {
  let service: OtherIncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherIncomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
