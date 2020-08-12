import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListPickDialogComponent } from './employee-list-pick-dialog.component';

describe('EmployeeListPickDialogComponent', () => {
  let component: EmployeeListPickDialogComponent;
  let fixture: ComponentFixture<EmployeeListPickDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeListPickDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListPickDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
