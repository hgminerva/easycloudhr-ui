import { TestBed } from '@angular/core/testing';

import { SystemTablesDetailService } from './system-tables-detail.service';

describe('SystemTablesDetailService', () => {
  let service: SystemTablesDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemTablesDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
