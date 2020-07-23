import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCodeDetailComponent } from './shift-code-detail.component';

describe('ShiftCodeDetailComponent', () => {
  let component: ShiftCodeDetailComponent;
  let fixture: ComponentFixture<ShiftCodeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCodeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCodeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
