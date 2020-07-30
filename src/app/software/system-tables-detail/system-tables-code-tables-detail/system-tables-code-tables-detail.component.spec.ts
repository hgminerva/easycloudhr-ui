import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTablesCodeTablesDetailComponent } from './system-tables-code-tables-detail.component';

describe('SystemTablesCodeTablesDetailComponent', () => {
  let component: SystemTablesCodeTablesDetailComponent;
  let fixture: ComponentFixture<SystemTablesCodeTablesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemTablesCodeTablesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTablesCodeTablesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
