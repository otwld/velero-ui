import { Test, TestingModule } from '@nestjs/testing';
import { ServerStatusRequestService } from './server-status-request.service';

describe('ServerStatusRequestService', () => {
  let service: ServerStatusRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerStatusRequestService],
    }).compile();

    service = module.get<ServerStatusRequestService>(
      ServerStatusRequestService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
