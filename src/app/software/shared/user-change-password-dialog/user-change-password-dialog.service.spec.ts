import { TestBed } from '@angular/core/testing';

import { UserChangePasswordDialogService } from './user-change-password-dialog.service';

describe('UserChangePasswordDialogService', () => {
  let service: UserChangePasswordDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserChangePasswordDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
