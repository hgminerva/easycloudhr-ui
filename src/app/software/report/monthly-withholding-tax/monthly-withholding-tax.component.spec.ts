import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyWithholdingTaxComponent } from './monthly-withholding-tax.component';

describe('MonthlyWithholdingTaxComponent', () => {
  let component: MonthlyWithholdingTaxComponent;
  let fixture: ComponentFixture<MonthlyWithholdingTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyWithholdingTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyWithholdingTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
