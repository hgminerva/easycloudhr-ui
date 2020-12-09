import { TestBed } from '@angular/core/testing';

import { MandatoryReportService } from './mandatory-report.service';

describe('MandatoryReportService', () => {
  let service: MandatoryReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandatoryReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
