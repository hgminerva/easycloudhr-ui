import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryTablesDetailMandatorySssDetailComponent } from './mandatory-tables-detail-mandatory-sss-detail.component';

describe('MandatoryTablesDetailMandatorySssDetailComponent', () => {
  let component: MandatoryTablesDetailMandatorySssDetailComponent;
  let fixture: ComponentFixture<MandatoryTablesDetailMandatorySssDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryTablesDetailMandatorySssDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryTablesDetailMandatorySssDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
