import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryReportComponent } from './mandatory-report.component';

describe('MandatoryReportComponent', () => {
  let component: MandatoryReportComponent;
  let fixture: ComponentFixture<MandatoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
