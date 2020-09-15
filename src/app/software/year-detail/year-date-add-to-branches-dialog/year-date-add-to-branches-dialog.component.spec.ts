import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearDateAddToBranchesDialogComponent } from './year-date-add-to-branches-dialog.component';

describe('YearDateAddToBranchesDialogComponent', () => {
  let component: YearDateAddToBranchesDialogComponent;
  let fixture: ComponentFixture<YearDateAddToBranchesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearDateAddToBranchesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearDateAddToBranchesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
