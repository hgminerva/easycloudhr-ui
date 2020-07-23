import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationDetailComponent } from './leave-application-detail.component';

describe('LeaveApplicationDetailComponent', () => {
  let component: LeaveApplicationDetailComponent;
  let fixture: ComponentFixture<LeaveApplicationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveApplicationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
