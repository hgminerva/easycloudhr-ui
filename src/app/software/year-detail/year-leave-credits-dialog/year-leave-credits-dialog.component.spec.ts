import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearLeaveCreditsDialogComponent } from './year-leave-credits-dialog.component';

describe('YearLeaveCreditsDialogComponent', () => {
  let component: YearLeaveCreditsDialogComponent;
  let fixture: ComponentFixture<YearLeaveCreditsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearLeaveCreditsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearLeaveCreditsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
