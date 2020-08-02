import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetialLinkToUsernameDialogComponent } from './employee-detial-link-to-username-dialog.component';

describe('EmployeeDetialLinkToUsernameDialogComponent', () => {
  let component: EmployeeDetialLinkToUsernameDialogComponent;
  let fixture: ComponentFixture<EmployeeDetialLinkToUsernameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetialLinkToUsernameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetialLinkToUsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
