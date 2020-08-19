import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDetailDialogComponent } from './loan-detail-dialog.component';

describe('LoanDetailDialogComponent', () => {
  let component: LoanDetailDialogComponent;
  let fixture: ComponentFixture<LoanDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
