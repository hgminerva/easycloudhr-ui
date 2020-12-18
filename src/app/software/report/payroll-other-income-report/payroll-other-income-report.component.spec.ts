import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherIncomeReportComponent } from './payroll-other-income-report.component';

describe('PayrollOtherIncomeReportComponent', () => {
  let component: PayrollOtherIncomeReportComponent;
  let fixture: ComponentFixture<PayrollOtherIncomeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherIncomeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherIncomeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
