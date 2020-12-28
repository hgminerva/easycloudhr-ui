import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyJournalVoucherComponent } from './company-journal-voucher.component';

describe('CompanyJournalVoucherComponent', () => {
  let component: CompanyJournalVoucherComponent;
  let fixture: ComponentFixture<CompanyJournalVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyJournalVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
