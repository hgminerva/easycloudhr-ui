import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationLineDetailComponent } from './leave-application-line-detail.component';

describe('LeaveApplicationLineDetailComponent', () => {
  let component: LeaveApplicationLineDetailComponent;
  let fixture: ComponentFixture<LeaveApplicationLineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveApplicationLineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveApplicationLineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
