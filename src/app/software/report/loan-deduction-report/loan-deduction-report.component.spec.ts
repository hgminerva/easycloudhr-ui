import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeductionReportComponent } from './loan-deduction-report.component';

describe('LoanDeductionReportComponent', () => {
  let component: LoanDeductionReportComponent;
  let fixture: ComponentFixture<LoanDeductionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeductionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
