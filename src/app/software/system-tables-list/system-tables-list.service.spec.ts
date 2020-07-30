import { TestBed } from '@angular/core/testing';

import { SystemTablesListService } from './system-tables-list.service';

describe('SystemTablesListService', () => {
  let service: SystemTablesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemTablesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
