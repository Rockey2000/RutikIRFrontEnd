import { TestBed } from '@angular/core/testing';

import { BreadcrumbServiceService } from './breadcrumb-service.service';

describe('BreadcrumbServiceService', () => {
  let service: BreadcrumbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadcrumbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
