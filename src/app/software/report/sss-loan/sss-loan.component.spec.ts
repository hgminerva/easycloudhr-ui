import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SssLoanComponent } from './sss-loan.component';

describe('SssLoanComponent', () => {
  let component: SssLoanComponent;
  let fixture: ComponentFixture<SssLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SssLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SssLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
