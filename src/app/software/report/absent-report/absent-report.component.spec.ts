import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentReportComponent } from './absent-report.component';

describe('AbsentReportComponent', () => {
  let component: AbsentReportComponent;
  let fixture: ComponentFixture<AbsentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
