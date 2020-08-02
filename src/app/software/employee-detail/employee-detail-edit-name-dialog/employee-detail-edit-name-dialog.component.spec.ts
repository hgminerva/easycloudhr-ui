import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailEditNameDialogComponent } from './employee-detail-edit-name-dialog.component';

describe('EmployeeDetailEditNameDialogComponent', () => {
  let component: EmployeeDetailEditNameDialogComponent;
  let fixture: ComponentFixture<EmployeeDetailEditNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetailEditNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailEditNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
