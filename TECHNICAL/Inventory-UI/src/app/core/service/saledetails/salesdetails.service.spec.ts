import { TestBed } from '@angular/core/testing';

import { SalesdetailsService } from './salesdetails.service';

describe('SalesdetailsService', () => {
  let service: SalesdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
