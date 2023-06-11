import { TestBed } from '@angular/core/testing';

import { NumberConvertService } from './number-convert.service';

describe('NumberConvertService', () => {
  let service: NumberConvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberConvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
