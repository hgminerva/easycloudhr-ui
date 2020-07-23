import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTypeDetailComponent } from './day-type-detail.component';

describe('DayTypeDetailComponent', () => {
  let component: DayTypeDetailComponent;
  let fixture: ComponentFixture<DayTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
