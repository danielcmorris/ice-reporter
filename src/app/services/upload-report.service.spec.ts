import { TestBed } from '@angular/core/testing';

import { UploadReportService } from './upload-report.service';

describe('UploadReportService', () => {
  let service: UploadReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
