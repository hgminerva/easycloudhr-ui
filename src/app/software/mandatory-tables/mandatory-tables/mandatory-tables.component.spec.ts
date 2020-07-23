import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryTablesComponent } from './mandatory-tables.component';

describe('MandatoryTablesComponent', () => {
  let component: MandatoryTablesComponent;
  let fixture: ComponentFixture<MandatoryTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
