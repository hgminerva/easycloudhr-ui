import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TardinessReportComponent } from './tardiness-report.component';

describe('TardinessReportComponent', () => {
  let component: TardinessReportComponent;
  let fixture: ComponentFixture<TardinessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TardinessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TardinessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
