import { TestBed } from '@angular/core/testing';

import { RecordFreezeManager } from '../record-freeze-manager.service';

describe('ExportPackageGeneratorService', () => {
  let service: RecordFreezeManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordFreezeManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
