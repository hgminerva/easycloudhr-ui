import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryTablesListComponent } from './mandatory-tables-list.component';

describe('MandatoryTablesListComponent', () => {
  let component: MandatoryTablesListComponent;
  let fixture: ComponentFixture<MandatoryTablesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryTablesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryTablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
