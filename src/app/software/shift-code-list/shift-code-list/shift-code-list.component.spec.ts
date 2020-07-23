import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCodeListComponent } from './shift-code-list.component';

describe('ShiftCodeListComponent', () => {
  let component: ShiftCodeListComponent;
  let fixture: ComponentFixture<ShiftCodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
