import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeApplicationLineDialogComponent } from './overtime-application-line-dialog.component';

describe('OvertimeApplicationLineDialogComponent', () => {
  let component: OvertimeApplicationLineDialogComponent;
  let fixture: ComponentFixture<OvertimeApplicationLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeApplicationLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeApplicationLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
