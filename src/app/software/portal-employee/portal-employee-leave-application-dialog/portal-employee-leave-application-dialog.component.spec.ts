import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeLeaveApplicationDialogComponent } from './portal-employee-leave-application-dialog.component';

describe('PortalEmployeeLeaveApplicationDialogComponent', () => {
  let component: PortalEmployeeLeaveApplicationDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeLeaveApplicationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeLeaveApplicationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeLeaveApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
