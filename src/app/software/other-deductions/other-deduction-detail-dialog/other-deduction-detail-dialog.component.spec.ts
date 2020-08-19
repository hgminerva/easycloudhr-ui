import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDeductionDetailDialogComponent } from './other-deduction-detail-dialog.component';

describe('OtherDeductionDetailDialogComponent', () => {
  let component: OtherDeductionDetailDialogComponent;
  let fixture: ComponentFixture<OtherDeductionDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherDeductionDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherDeductionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
