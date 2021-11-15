import { TestBed } from '@angular/core/testing';

import { RecordFreezeApiService } from '../record-freeze-api.service';

describe('RecordManagerService', () => {
  let service: RecordFreezeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordFreezeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
