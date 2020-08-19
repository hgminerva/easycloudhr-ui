import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherDeductionDetailComponent } from './payroll-other-deduction-detail.component';

describe('PayrollOtherDeductionDetailComponent', () => {
  let component: PayrollOtherDeductionDetailComponent;
  let fixture: ComponentFixture<PayrollOtherDeductionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherDeductionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherDeductionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
