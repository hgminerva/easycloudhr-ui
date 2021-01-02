import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtrDetailDtrLineAddDialogComponent } from './dtr-detail-dtr-line-add-dialog.component';

describe('DtrDetailDtrLineAddDialogComponent', () => {
  let component: DtrDetailDtrLineAddDialogComponent;
  let fixture: ComponentFixture<DtrDetailDtrLineAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtrDetailDtrLineAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtrDetailDtrLineAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
