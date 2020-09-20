import { TestBed } from '@angular/core/testing';

import { DtrDetailImportDtrLogsService } from './dtr-detail-import-dtr-logs.service';

describe('DtrDetailImportDtrLogsService', () => {
  let service: DtrDetailImportDtrLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtrDetailImportDtrLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
