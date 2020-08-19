import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherIncomeListComponent } from './payroll-other-income-list.component';

describe('PayrollOtherIncomeListComponent', () => {
  let component: PayrollOtherIncomeListComponent;
  let fixture: ComponentFixture<PayrollOtherIncomeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherIncomeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherIncomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
