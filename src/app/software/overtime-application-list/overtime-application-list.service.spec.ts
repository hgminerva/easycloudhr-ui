import { TestBed } from '@angular/core/testing';

import { OvertimeApplicationListService } from './overtime-application-list.service';

describe('OvertimeApplicationListService', () => {
  let service: OvertimeApplicationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimeApplicationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
