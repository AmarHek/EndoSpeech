import { TestBed } from '@angular/core/testing';

import { DisplayService } from '../services/display.service';

describe('DisplayNavbarService', () => {
  let service: DisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
