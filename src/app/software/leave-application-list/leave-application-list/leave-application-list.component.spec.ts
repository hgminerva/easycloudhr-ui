import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationListComponent } from './leave-application-list.component';

describe('LeaveApplicationListComponent', () => {
  let component: LeaveApplicationListComponent;
  let fixture: ComponentFixture<LeaveApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
