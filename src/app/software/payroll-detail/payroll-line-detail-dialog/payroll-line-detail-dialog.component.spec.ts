import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollLineDetailDialogComponent } from './payroll-line-detail-dialog.component';

describe('PayrollLineDetailDialogComponent', () => {
  let component: PayrollLineDetailDialogComponent;
  let fixture: ComponentFixture<PayrollLineDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollLineDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollLineDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
