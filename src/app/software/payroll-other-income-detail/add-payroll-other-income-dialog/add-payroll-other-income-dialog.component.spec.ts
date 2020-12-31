import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayrollOtherIncomeDialogComponent } from './add-payroll-other-income-dialog.component';

describe('AddPayrollOtherIncomeDialogComponent', () => {
  let component: AddPayrollOtherIncomeDialogComponent;
  let fixture: ComponentFixture<AddPayrollOtherIncomeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayrollOtherIncomeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayrollOtherIncomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
