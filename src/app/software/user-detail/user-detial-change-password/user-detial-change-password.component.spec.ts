import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetialChangePasswordComponent } from './user-detial-change-password.component';

describe('UserDetialChangePasswordComponent', () => {
  let component: UserDetialChangePasswordComponent;
  let fixture: ComponentFixture<UserDetialChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetialChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetialChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
