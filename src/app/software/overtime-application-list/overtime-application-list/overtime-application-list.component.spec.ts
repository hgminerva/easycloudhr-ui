import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeApplicationListComponent } from './overtime-application-list.component';

describe('OvertimeApplicationListComponent', () => {
  let component: OvertimeApplicationListComponent;
  let fixture: ComponentFixture<OvertimeApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
