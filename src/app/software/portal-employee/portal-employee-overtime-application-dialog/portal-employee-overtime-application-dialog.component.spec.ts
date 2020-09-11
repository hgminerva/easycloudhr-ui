import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeOvertimeApplicationDialogComponent } from './portal-employee-overtime-application-dialog.component';

describe('PortalEmployeeOvertimeApplicationDialogComponent', () => {
  let component: PortalEmployeeOvertimeApplicationDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeOvertimeApplicationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeOvertimeApplicationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeOvertimeApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
