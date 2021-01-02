import { TestBed } from '@angular/core/testing';

import { DtrDetialService } from './dtr-detial.service';

describe('DtrDetialService', () => {
  let service: DtrDetialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtrDetialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
