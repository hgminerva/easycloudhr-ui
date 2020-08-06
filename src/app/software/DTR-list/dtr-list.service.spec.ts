import { TestBed } from '@angular/core/testing';

import { DTRListService } from './dtr-list.service';

describe('DTRListService', () => {
  let service: DTRListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DTRListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
