import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeLoanDialogComponent } from './portal-employee-loan-dialog.component';

describe('PortalEmployeeLoanDialogComponent', () => {
  let component: PortalEmployeeLoanDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeLoanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeLoanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeLoanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
