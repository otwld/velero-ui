import { Test, TestingModule } from '@nestjs/testing';
import { DownloadRequestService } from 'apps/velero-ui-api/src/app/modules/download-request/download-request.service';

describe('DownloadRequestService', () => {
  let service: DownloadRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadRequestService],
    }).compile();

    service = module.get<DownloadRequestService>(DownloadRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
