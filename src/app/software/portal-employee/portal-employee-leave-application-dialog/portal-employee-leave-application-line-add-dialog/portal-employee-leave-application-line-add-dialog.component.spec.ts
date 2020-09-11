import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeLeaveApplicationLineAddDialogComponent } from './portal-employee-leave-application-line-add-dialog.component';

describe('PortalEmployeeLeaveApplicationLineAddDialogComponent', () => {
  let component: PortalEmployeeLeaveApplicationLineAddDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeLeaveApplicationLineAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeLeaveApplicationLineAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeLeaveApplicationLineAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
