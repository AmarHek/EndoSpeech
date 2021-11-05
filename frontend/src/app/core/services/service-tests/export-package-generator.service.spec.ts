import { TestBed } from '@angular/core/testing';

import { RecordGeneratorService } from '../record-generator.service';

describe('ExportPackageGeneratorService', () => {
  let service: RecordGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
