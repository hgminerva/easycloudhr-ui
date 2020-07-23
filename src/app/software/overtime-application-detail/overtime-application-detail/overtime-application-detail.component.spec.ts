import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeApplicationDetailComponent } from './overtime-application-detail.component';

describe('OvertimeApplicationDetailComponent', () => {
  let component: OvertimeApplicationDetailComponent;
  let fixture: ComponentFixture<OvertimeApplicationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeApplicationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
