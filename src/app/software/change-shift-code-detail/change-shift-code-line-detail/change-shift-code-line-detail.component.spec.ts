import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeShiftCodeLineDetailComponent } from './change-shift-code-line-detail.component';

describe('ChangeShiftCodeLineDetailComponent', () => {
  let component: ChangeShiftCodeLineDetailComponent;
  let fixture: ComponentFixture<ChangeShiftCodeLineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeShiftCodeLineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeShiftCodeLineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
