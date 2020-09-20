import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtrDetailImportDtrLogsComponent } from './dtr-detail-import-dtr-logs.component';

describe('DtrDetailImportDtrLogsComponent', () => {
  let component: DtrDetailImportDtrLogsComponent;
  let fixture: ComponentFixture<DtrDetailImportDtrLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtrDetailImportDtrLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtrDetailImportDtrLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
