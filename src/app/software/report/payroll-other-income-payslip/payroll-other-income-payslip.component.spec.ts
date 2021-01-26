import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherIncomePayslipComponent } from './payroll-other-income-payslip.component';

describe('PayrollOtherIncomePayslipComponent', () => {
  let component: PayrollOtherIncomePayslipComponent;
  let fixture: ComponentFixture<PayrollOtherIncomePayslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherIncomePayslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherIncomePayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
