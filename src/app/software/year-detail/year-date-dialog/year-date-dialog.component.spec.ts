import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearDateDialogComponent } from './year-date-dialog.component';

describe('YearDateDialogComponent', () => {
  let component: YearDateDialogComponent;
  let fixture: ComponentFixture<YearDateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearDateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
