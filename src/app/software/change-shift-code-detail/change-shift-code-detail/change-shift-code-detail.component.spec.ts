import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeShiftCodeDetailComponent } from './change-shift-code-detail.component';

describe('ChangeShiftCodeDetailComponent', () => {
  let component: ChangeShiftCodeDetailComponent;
  let fixture: ComponentFixture<ChangeShiftCodeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeShiftCodeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeShiftCodeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
