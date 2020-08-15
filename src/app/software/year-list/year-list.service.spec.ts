import { TestBed } from '@angular/core/testing';

import { YearListService } from './year-list.service';

describe('YearListService', () => {
  let service: YearListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
