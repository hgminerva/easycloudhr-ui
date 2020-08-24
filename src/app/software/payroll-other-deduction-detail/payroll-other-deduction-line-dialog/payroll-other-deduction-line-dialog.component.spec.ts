import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherDeductionLineDialogComponent } from './payroll-other-deduction-line-dialog.component';

describe('PayrollOtherDeductionLineDialogComponent', () => {
  let component: PayrollOtherDeductionLineDialogComponent;
  let fixture: ComponentFixture<PayrollOtherDeductionLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherDeductionLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherDeductionLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
