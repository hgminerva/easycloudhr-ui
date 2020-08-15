import { TestBed } from '@angular/core/testing';

import { YearDetialService } from './year-detial.service';

describe('YearDetialService', () => {
  let service: YearDetialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearDetialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
