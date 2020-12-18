import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollWorkSheetComponent } from './payroll-work-sheet.component';

describe('PayrollWorkSheetComponent', () => {
  let component: PayrollWorkSheetComponent;
  let fixture: ComponentFixture<PayrollWorkSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollWorkSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollWorkSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
