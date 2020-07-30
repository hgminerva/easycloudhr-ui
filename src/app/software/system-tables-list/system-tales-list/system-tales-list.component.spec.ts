import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTalesListComponent } from './system-tales-list.component';

describe('SystemTalesListComponent', () => {
  let component: SystemTalesListComponent;
  let fixture: ComponentFixture<SystemTalesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemTalesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
