import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailApproverComponent } from './company-detail-approver.component';

describe('CompanyDetailApproverComponent', () => {
  let component: CompanyDetailApproverComponent;
  let fixture: ComponentFixture<CompanyDetailApproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDetailApproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
