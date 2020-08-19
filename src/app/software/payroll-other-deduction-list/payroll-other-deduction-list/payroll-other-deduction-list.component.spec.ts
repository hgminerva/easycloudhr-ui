import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOtherDeductionListComponent } from './payroll-other-deduction-list.component';

describe('PayrollOtherDeductionListComponent', () => {
  let component: PayrollOtherDeductionListComponent;
  let fixture: ComponentFixture<PayrollOtherDeductionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollOtherDeductionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollOtherDeductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
