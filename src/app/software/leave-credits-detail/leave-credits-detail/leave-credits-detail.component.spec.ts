import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCreditsDetailComponent } from './leave-credits-detail.component';

describe('LeaveCreditsDetailComponent', () => {
  let component: LeaveCreditsDetailComponent;
  let fixture: ComponentFixture<LeaveCreditsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveCreditsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCreditsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
