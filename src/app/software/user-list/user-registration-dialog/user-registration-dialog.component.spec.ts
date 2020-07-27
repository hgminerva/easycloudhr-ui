import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationDialogComponent } from './user-registration-dialog.component';

describe('UserRegistrationDialogComponent', () => {
  let component: UserRegistrationDialogComponent;
  let fixture: ComponentFixture<UserRegistrationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRegistrationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegistrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
