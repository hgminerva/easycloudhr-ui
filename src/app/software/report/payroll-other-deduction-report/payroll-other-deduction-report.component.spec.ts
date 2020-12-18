import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherDeductionReportComponent } from './payroll-other-deduction-report.component';

describe('PayrollOtherDeductionReportComponent', () => {
  let component: PayrollOtherDeductionReportComponent;
  let fixture: ComponentFixture<PayrollOtherDeductionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherDeductionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherDeductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
