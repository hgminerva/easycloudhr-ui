import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeShiftCodeListComponent } from './change-shift-code-list.component';

describe('ChangeShiftCodeListComponent', () => {
  let component: ChangeShiftCodeListComponent;
  let fixture: ComponentFixture<ChangeShiftCodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeShiftCodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeShiftCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
