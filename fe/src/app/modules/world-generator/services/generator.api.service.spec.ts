import { TestBed } from '@angular/core/testing';

import { GeneratorApiService } from './generator.api.service';

describe('GeneratorApiService', () => {
  let service: GeneratorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
