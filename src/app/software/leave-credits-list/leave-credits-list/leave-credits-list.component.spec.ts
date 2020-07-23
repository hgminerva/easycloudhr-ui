import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCreditsListComponent } from './leave-credits-list.component';

describe('LeaveCreditsListComponent', () => {
  let component: LeaveCreditsListComponent;
  let fixture: ComponentFixture<LeaveCreditsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveCreditsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCreditsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
