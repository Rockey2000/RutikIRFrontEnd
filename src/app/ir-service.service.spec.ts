import { TestBed } from '@angular/core/testing';

import { IRServiceService } from './ir-service.service';

describe('IRServiceService', () => {
  let service: IRServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IRServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
