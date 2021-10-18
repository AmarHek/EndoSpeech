import { TestBed } from '@angular/core/testing';

import { RecordManagerService } from '../services/record-manager.service';

describe('RecordManagerService', () => {
  let service: RecordManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
