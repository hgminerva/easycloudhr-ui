import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeOvertimeApplicationLineAddDialogComponent } from './portal-employee-overtime-application-line-add-dialog.component';

describe('PortalEmployeeOvertimeApplicationLineAddDialogComponent', () => {
  let component: PortalEmployeeOvertimeApplicationLineAddDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeOvertimeApplicationLineAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeOvertimeApplicationLineAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeOvertimeApplicationLineAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
