import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCodeDetialShiftLineComponent } from './shift-code-detial-shift-line.component';

describe('ShiftCodeDetialShiftLineComponent', () => {
  let component: ShiftCodeDetialShiftLineComponent;
  let fixture: ComponentFixture<ShiftCodeDetialShiftLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCodeDetialShiftLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCodeDetialShiftLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
