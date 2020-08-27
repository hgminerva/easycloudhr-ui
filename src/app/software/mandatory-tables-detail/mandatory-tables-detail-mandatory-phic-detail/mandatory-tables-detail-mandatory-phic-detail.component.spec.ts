import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryTablesDetailMandatoryPhicDetailComponent } from './mandatory-tables-detail-mandatory-phic-detail.component';

describe('MandatoryTablesDetailMandatoryPhicDetailComponent', () => {
  let component: MandatoryTablesDetailMandatoryPhicDetailComponent;
  let fixture: ComponentFixture<MandatoryTablesDetailMandatoryPhicDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryTablesDetailMandatoryPhicDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryTablesDetailMandatoryPhicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
