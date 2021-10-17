import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveProductDialogComponent } from './active-product-dialog.component';

describe('ProductLookupDialogComponent', () => {
  let component: ActiveProductDialogComponent;
  let fixture: ComponentFixture<ActiveProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveProductDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
