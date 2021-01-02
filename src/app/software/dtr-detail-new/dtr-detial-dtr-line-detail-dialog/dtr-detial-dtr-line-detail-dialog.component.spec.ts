import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtrDetialDtrLineDetailDialogComponent } from './dtr-detial-dtr-line-detail-dialog.component';

describe('DtrDetialDtrLineDetailDialogComponent', () => {
  let component: DtrDetialDtrLineDetailDialogComponent;
  let fixture: ComponentFixture<DtrDetialDtrLineDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtrDetialDtrLineDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtrDetialDtrLineDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
