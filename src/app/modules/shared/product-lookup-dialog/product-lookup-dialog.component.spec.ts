import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLookupDialogComponent } from './product-lookup-dialog.component';

describe('ProductLookupDialogComponent', () => {
  let component: ProductLookupDialogComponent;
  let fixture: ComponentFixture<ProductLookupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductLookupDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLookupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
