import { TestBed } from '@angular/core/testing';

import { TableOutputService } from '../table-output.service';

describe('ExportPackageGeneratorService', () => {
  let service: TableOutputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableOutputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
