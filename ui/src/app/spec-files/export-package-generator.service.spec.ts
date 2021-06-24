import { TestBed } from '@angular/core/testing';

import { HtmlOutputService } from '../documentation/output/html-output.service';

describe('ExportPackageGeneratorService', () => {
  let service: HtmlOutputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlOutputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
