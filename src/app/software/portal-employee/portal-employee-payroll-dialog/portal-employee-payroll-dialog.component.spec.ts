import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeePayrollDialogComponent } from './portal-employee-payroll-dialog.component';

describe('PortalEmployeePayrollDialogComponent', () => {
  let component: PortalEmployeePayrollDialogComponent;
  let fixture: ComponentFixture<PortalEmployeePayrollDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeePayrollDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeePayrollDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
