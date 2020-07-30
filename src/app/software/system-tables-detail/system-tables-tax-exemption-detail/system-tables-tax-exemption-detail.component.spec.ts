import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTablesTaxExemptionDetailComponent } from './system-tables-tax-exemption-detail.component';

describe('SystemTablesTaxExemptionDetailComponent', () => {
  let component: SystemTablesTaxExemptionDetailComponent;
  let fixture: ComponentFixture<SystemTablesTaxExemptionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemTablesTaxExemptionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTablesTaxExemptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
