import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DTRListComponent } from './dtr-list.component';

describe('DTRListComponent', () => {
  let component: DTRListComponent;
  let fixture: ComponentFixture<DTRListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DTRListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DTRListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
