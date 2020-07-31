import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailUserModuleDialogComponent } from './user-detail-user-module-dialog.component';

describe('UserDetailUserModuleDialogComponent', () => {
  let component: UserDetailUserModuleDialogComponent;
  let fixture: ComponentFixture<UserDetailUserModuleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailUserModuleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailUserModuleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
