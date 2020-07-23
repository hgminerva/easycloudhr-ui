import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DTRDetailComponent } from './dtr-detail.component';

describe('DTRDetailComponent', () => {
  let component: DTRDetailComponent;
  let fixture: ComponentFixture<DTRDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DTRDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DTRDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
