import { TestBed } from '@angular/core/testing';

import { ProductsGridNavigationService } from './products-grid-navigation.service';

describe('FormAndGridNavigationService', () => {
  let service: ProductsGridNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsGridNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
