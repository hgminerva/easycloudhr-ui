import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxExemptionTableDialogComponent } from './tax-exemption-table-dialog.component';

describe('TaxExemptionTableDialogComponent', () => {
  let component: TaxExemptionTableDialogComponent;
  let fixture: ComponentFixture<TaxExemptionTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxExemptionTableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxExemptionTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
