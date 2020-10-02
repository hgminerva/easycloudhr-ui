import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmMassageDialogComponent } from './comfirm-massage-dialog.component';

describe('ComfirmMassageDialogComponent', () => {
  let component: ComfirmMassageDialogComponent;
  let fixture: ComponentFixture<ComfirmMassageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComfirmMassageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmMassageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
