import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SssCalamityLoanComponent } from './sss-calamity-loan.component';

describe('SssCalamityLoanComponent', () => {
  let component: SssCalamityLoanComponent;
  let fixture: ComponentFixture<SssCalamityLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SssCalamityLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SssCalamityLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
