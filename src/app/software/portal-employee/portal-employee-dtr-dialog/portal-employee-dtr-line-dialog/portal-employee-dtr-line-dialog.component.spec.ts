import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeDtrLineDialogComponent } from './portal-employee-dtr-line-dialog.component';

describe('PortalEmployeeDtrLineDialogComponent', () => {
  let component: PortalEmployeeDtrLineDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeDtrLineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeDtrLineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeDtrLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
