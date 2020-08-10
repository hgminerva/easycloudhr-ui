import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpoloyeeListDialogComponent } from './empoloyee-list-dialog.component';

describe('EmpoloyeeListDialogComponent', () => {
  let component: EmpoloyeeListDialogComponent;
  let fixture: ComponentFixture<EmpoloyeeListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpoloyeeListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpoloyeeListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
