import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailEmployeeMemoComponent } from './employee-detail-employee-memo.component';

describe('EmployeeDetailEmployeeMemoComponent', () => {
  let component: EmployeeDetailEmployeeMemoComponent;
  let fixture: ComponentFixture<EmployeeDetailEmployeeMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetailEmployeeMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailEmployeeMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
