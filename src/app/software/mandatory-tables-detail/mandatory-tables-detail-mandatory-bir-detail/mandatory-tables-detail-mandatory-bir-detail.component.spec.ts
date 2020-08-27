import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryTablesDetailMandatoryBirDetailComponent } from './mandatory-tables-detail-mandatory-bir-detail.component';

describe('MandatoryTablesDetailMandatoryBirDetailComponent', () => {
  let component: MandatoryTablesDetailMandatoryBirDetailComponent;
  let fixture: ComponentFixture<MandatoryTablesDetailMandatoryBirDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryTablesDetailMandatoryBirDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryTablesDetailMandatoryBirDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
