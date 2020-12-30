import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmBankReportComponent } from './atm-bank-report.component';

describe('AtmBankReportComponent', () => {
  let component: AtmBankReportComponent;
  let fixture: ComponentFixture<AtmBankReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtmBankReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtmBankReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
