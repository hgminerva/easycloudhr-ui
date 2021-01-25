import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanLedgerComponent } from './loan-ledger.component';

describe('LoanLedgerComponent', () => {
  let component: LoanLedgerComponent;
  let fixture: ComponentFixture<LoanLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
