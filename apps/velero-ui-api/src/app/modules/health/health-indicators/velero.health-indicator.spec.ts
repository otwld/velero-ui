import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { VeleroService } from '@velero-ui-api/shared/modules/velero/velero.service';
import { VeleroHealthIndicator } from './velero.health-indicator';

jest.mock('@velero-ui-api/shared/modules/velero/velero.service', () => ({
  VeleroService: class VeleroService {},
}));

describe('VeleroHealthIndicator', () => {
  let module: TestingModule;
  let service: VeleroHealthIndicator;
  const getServerStatus = jest.fn();

  beforeEach(async () => {
    getServerStatus.mockReset();
    module = await Test.createTestingModule({
      providers: [
        VeleroHealthIndicator,
        { provide: VeleroService, useValue: { getServerStatus } },
      ],
    }).compile();

    service = module.get<VeleroHealthIndicator>(VeleroHealthIndicator);
  });

  afterEach(async () => {
    await module.close();
  });

  it.each([
    ['Running', 'up'],
    ['Pending', 'down'],
    ['Failed', 'down'],
    [undefined, 'down'],
  ])('reports pod phase %s as %s', async (phase, status) => {
    getServerStatus.mockReturnValueOnce(of({ phase }));

    await expect(firstValueFrom(service.isHealthy())).resolves.toEqual({
      velero: { status, phase },
    });
    expect(getServerStatus).toHaveBeenCalledTimes(1);
  });

  it('reports a missing pod status as down', async () => {
    getServerStatus.mockReturnValueOnce(of(undefined));

    await expect(firstValueFrom(service.isHealthy())).resolves.toEqual({
      velero: { status: 'down', phase: undefined },
    });
  });

  it('propagates a failed server status request', async () => {
    const error = new Error('Velero server unavailable');
    getServerStatus.mockReturnValueOnce(throwError(() => error));

    await expect(firstValueFrom(service.isHealthy())).rejects.toBe(error);
  });
});
