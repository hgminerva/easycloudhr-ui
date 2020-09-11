import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeeDtrDialogComponent } from './portal-employee-dtr-dialog.component';

describe('PortalEmployeeDtrDialogComponent', () => {
  let component: PortalEmployeeDtrDialogComponent;
  let fixture: ComponentFixture<PortalEmployeeDtrDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeeDtrDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeeDtrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
