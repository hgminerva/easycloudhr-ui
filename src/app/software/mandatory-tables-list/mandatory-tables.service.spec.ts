import { TestBed } from '@angular/core/testing';

import { MandatoryTablesService } from './mandatory-tables.service';

describe('MandatoryTablesService', () => {
  let service: MandatoryTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandatoryTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
