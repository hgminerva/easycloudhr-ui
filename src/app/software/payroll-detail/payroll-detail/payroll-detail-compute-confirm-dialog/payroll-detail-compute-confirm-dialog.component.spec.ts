import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollDetailComputeConfirmDialogComponent } from './payroll-detail-compute-confirm-dialog.component';

describe('PayrollDetailComputeConfirmDialogComponent', () => {
  let component: PayrollDetailComputeConfirmDialogComponent;
  let fixture: ComponentFixture<PayrollDetailComputeConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollDetailComputeConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollDetailComputeConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
