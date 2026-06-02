import { TestBed } from '@angular/core/testing';

import { BloquesService } from './bloques.service';

describe('BloquesService', () => {
  let service: BloquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
