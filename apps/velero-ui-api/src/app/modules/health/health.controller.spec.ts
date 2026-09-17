import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TerminusModule } from '@nestjs/terminus';
import { AddressInfo } from 'node:net';
import { of } from 'rxjs';

jest.mock(
  '@velero-ui-api/modules/health/health-indicators/k8s.health-indicator',
  () => ({ K8sHealthIndicator: class K8sHealthIndicator {} })
);
jest.mock(
  '@velero-ui-api/modules/health/health-indicators/velero.health-indicator',
  () => ({ VeleroHealthIndicator: class VeleroHealthIndicator {} })
);

import { HealthController } from './health.controller';
import { K8sHealthIndicator } from './health-indicators/k8s.health-indicator';
import { VeleroHealthIndicator } from './health-indicators/velero.health-indicator';

describe('HealthController', () => {
  let app: INestApplication;
  let baseUrl: string;

  const k8s = {
    isHealthy: jest.fn(() => of({ k8s: { status: 'up' } })),
  };
  const velero = {
    isHealthy: jest.fn(() =>
      of({ velero: { status: 'up', phase: 'Running' } })
    ),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        { provide: K8sHealthIndicator, useValue: k8s },
        { provide: VeleroHealthIndicator, useValue: velero },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.listen(0, '127.0.0.1');
    const { port } = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  it('answers the liveness probe without checking external dependencies', async () => {
    const response = await fetch(`${baseUrl}/health/live`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'ok',
      info: {},
      error: {},
      details: {},
    });
    expect(k8s.isHealthy).not.toHaveBeenCalled();
    expect(velero.isHealthy).not.toHaveBeenCalled();
  });

  it('answers the startup probe without checking external dependencies', async () => {
    const response = await fetch(`${baseUrl}/health/startup`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'ok',
      info: {},
      error: {},
      details: {},
    });
    expect(k8s.isHealthy).not.toHaveBeenCalled();
    expect(velero.isHealthy).not.toHaveBeenCalled();
  });

  it('reports external dependency health on the readiness endpoint', async () => {
    const response = await fetch(`${baseUrl}/health/ready`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'ok',
      info: {
        k8s: { status: 'up' },
        velero: { status: 'up', phase: 'Running' },
      },
      error: {},
      details: {
        k8s: { status: 'up' },
        velero: { status: 'up', phase: 'Running' },
      },
    });
    expect(k8s.isHealthy).toHaveBeenCalledTimes(1);
    expect(velero.isHealthy).toHaveBeenCalledTimes(1);
  });
});
