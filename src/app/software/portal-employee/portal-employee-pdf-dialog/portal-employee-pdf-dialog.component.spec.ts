import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalEmployeePdfDialogComponent } from './portal-employee-pdf-dialog.component';

describe('PortalEmployeePdfDialogComponent', () => {
  let component: PortalEmployeePdfDialogComponent;
  let fixture: ComponentFixture<PortalEmployeePdfDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalEmployeePdfDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalEmployeePdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
