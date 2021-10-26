import { TestBed } from '@angular/core/testing';

import { RecordRequestsService } from '../record-requests.service';

describe('RecordManagerService', () => {
  let service: RecordRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
