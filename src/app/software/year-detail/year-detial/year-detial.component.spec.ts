import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearDetialComponent } from './year-detial.component';

describe('YearDetialComponent', () => {
  let component: YearDetialComponent;
  let fixture: ComponentFixture<YearDetialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearDetialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearDetialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
