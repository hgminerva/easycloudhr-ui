import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherIncomeDetailComponent } from './payroll-other-income-detail.component';

describe('PayrollOtherIncomeDetailComponent', () => {
  let component: PayrollOtherIncomeDetailComponent;
  let fixture: ComponentFixture<PayrollOtherIncomeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherIncomeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherIncomeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
