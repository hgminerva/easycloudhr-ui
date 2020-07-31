import { TestBed } from '@angular/core/testing';

import { SoftwareSecurityService } from './software-security.service';

describe('SoftwareSecurityService', () => {
  let service: SoftwareSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftwareSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
