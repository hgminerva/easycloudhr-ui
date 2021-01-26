import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HdmfLoanReportComponent } from './hdmf-loan-report.component';

describe('HdmfLoanReportComponent', () => {
  let component: HdmfLoanReportComponent;
  let fixture: ComponentFixture<HdmfLoanReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdmfLoanReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdmfLoanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
