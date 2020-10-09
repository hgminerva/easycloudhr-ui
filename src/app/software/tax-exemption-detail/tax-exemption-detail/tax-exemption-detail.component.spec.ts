import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxExemptionDetailComponent } from './tax-exemption-detail.component';

describe('TaxExemptionDetailComponent', () => {
  let component: TaxExemptionDetailComponent;
  let fixture: ComponentFixture<TaxExemptionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxExemptionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxExemptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
