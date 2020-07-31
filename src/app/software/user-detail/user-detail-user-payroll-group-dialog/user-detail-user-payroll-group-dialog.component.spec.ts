import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailUserPayrollGroupDialogComponent } from './user-detail-user-payroll-group-dialog.component';

describe('UserDetailUserPayrollGroupDialogComponent', () => {
  let component: UserDetailUserPayrollGroupDialogComponent;
  let fixture: ComponentFixture<UserDetailUserPayrollGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailUserPayrollGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailUserPayrollGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
