import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherIncomeLineDialogComponent } from './payroll-other-income-line-dialog.component';

describe('PayrollOtherIncomeLineDialogComponent', () => {
  let component: PayrollOtherIncomeLineDialogComponent;
  let fixture: ComponentFixture<PayrollOtherIncomeLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherIncomeLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherIncomeLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
