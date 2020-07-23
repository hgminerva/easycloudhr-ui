import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTypeListComponent } from './day-type-list.component';

describe('DayTypeListComponent', () => {
  let component: DayTypeListComponent;
  let fixture: ComponentFixture<DayTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
