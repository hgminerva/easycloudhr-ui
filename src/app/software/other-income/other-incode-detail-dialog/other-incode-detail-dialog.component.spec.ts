import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherIncodeDetailDialogComponent } from './other-incode-detail-dialog.component';

describe('OtherIncodeDetailDialogComponent', () => {
  let component: OtherIncodeDetailDialogComponent;
  let fixture: ComponentFixture<OtherIncodeDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherIncodeDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherIncodeDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
