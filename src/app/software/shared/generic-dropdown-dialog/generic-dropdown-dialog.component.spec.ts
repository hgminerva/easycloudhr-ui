import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDropdownDialogComponent } from './generic-dropdown-dialog.component';

describe('GenericDropdownDialogComponent', () => {
  let component: GenericDropdownDialogComponent;
  let fixture: ComponentFixture<GenericDropdownDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDropdownDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDropdownDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
