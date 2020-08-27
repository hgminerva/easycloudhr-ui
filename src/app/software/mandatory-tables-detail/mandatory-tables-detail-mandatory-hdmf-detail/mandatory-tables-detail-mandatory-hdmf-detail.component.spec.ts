import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryTablesDetailMandatoryHdmfDetailComponent } from './mandatory-tables-detail-mandatory-hdmf-detail.component';

describe('MandatoryTablesDetailMandatoryHdmfDetailComponent', () => {
  let component: MandatoryTablesDetailMandatoryHdmfDetailComponent;
  let fixture: ComponentFixture<MandatoryTablesDetailMandatoryHdmfDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryTablesDetailMandatoryHdmfDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryTablesDetailMandatoryHdmfDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
