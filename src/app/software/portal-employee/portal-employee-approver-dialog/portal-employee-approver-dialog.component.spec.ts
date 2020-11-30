import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeApproverDialogComponent } from './portal-employee-approver-dialog.component';

describe('PortalEmployeeApproverDialogComponent', () => {
  let component: PortalEmployeeApproverDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeApproverDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeApproverDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeApproverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
