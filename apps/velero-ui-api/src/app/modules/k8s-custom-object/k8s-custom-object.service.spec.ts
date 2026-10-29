import { ConfigService } from '@nestjs/config';
import { KubeConfig } from '@kubernetes/client-node';
import { lastValueFrom } from 'rxjs';
import {
  K8sCustomObjectService,
  resourceApiVersion,
} from './k8s-custom-object.service';
import { AppLogger } from '../../shared/modules/logger/logger.service';
import { Socket } from 'socket.io';

const mockWatch = jest.fn().mockResolvedValue(new AbortController());
jest.mock('@kubernetes/client-node', () => ({
  CustomObjectsApi: class {},
  KubeConfig: class {},
  Watch: class {
    watch = mockWatch;
  },
}));

describe('data mover Kubernetes API versions', () => {
  it.each(['datauploads', 'datadownloads'])(
    'lists, gets and watches %s through v2alpha1',
    async (plural) => {
      const api = {
        listNamespacedCustomObject: jest.fn().mockResolvedValue({ items: [] }),
        getNamespacedCustomObject: jest.fn().mockResolvedValue({}),
      };
      const logger = {
        debug: jest.fn(),
        error: jest.fn(),
      } as unknown as AppLogger;
      const service = new K8sCustomObjectService(
        { makeApiClient: () => api } as unknown as KubeConfig,
        logger,
        new ConfigService({ velero: { namespace: 'velero' } })
      );
      await lastValueFrom(service.get(plural));
      await lastValueFrom(service.getByName(plural, 'operation'));
      await service.watch({ id: plural } as Socket, plural);
      expect(api.listNamespacedCustomObject).toHaveBeenCalledWith(
        expect.objectContaining({
          group: 'velero.io',
          version: 'v2alpha1',
          namespace: 'velero',
          plural,
        })
      );
      expect(api.getNamespacedCustomObject).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 'v2alpha1',
          plural,
          name: 'operation',
        })
      );
      expect(mockWatch).toHaveBeenCalledWith(
        `/apis/velero.io/v2alpha1/namespaces/velero/${plural}`,
        expect.anything(),
        expect.any(Function),
        expect.any(Function)
      );
    }
  );
  it('keeps existing Velero resources on v1', () => {
    expect(resourceApiVersion('backups')).toBe('v1');
    expect(resourceApiVersion('podvolumebackups')).toBe('v1');
  });
});

describe('concurrent Kubernetes subscriptions', () => {
  const make = () => {
    const service = new K8sCustomObjectService(
      { makeApiClient: () => ({}) } as unknown as KubeConfig,
      { debug: jest.fn(), error: jest.fn() } as unknown as AppLogger,
      new ConfigService({ velero: { namespace: 'velero' } })
    ) as K8sCustomObjectService & {
      unWatch(client: Socket, name?: string, plural?: string): void;
      unWatchAll(client: Socket): void;
    };
    const client = { id: 'viewer', emit: jest.fn() } as unknown as Socket;
    return { service, client };
  };

  beforeEach(() => {
    mockWatch.mockReset().mockImplementation(async () => new AbortController());
  });
  afterEach(() => jest.useRealTimers());

  it('keeps filesystem and data mover streams active on one socket and stops only the requested source', async () => {
    const { service, client } = make();
    const filesystem = new AbortController();
    const mover = new AbortController();
    mockWatch.mockResolvedValueOnce(filesystem).mockResolvedValueOnce(mover);
    await service.watch(client, 'podvolumebackups', undefined, '10');
    await service.watch(client, 'datauploads', undefined, '20');
    expect(filesystem.signal.aborted).toBe(false);
    expect(mover.signal.aborted).toBe(false);
    service.unWatch(client, undefined, 'datauploads');
    expect(mover.signal.aborted).toBe(true);
    expect(filesystem.signal.aborted).toBe(false);
    service.unWatchAll(client);
    expect(filesystem.signal.aborted).toBe(true);
  });

  it('aborts pending streams when the view unsubscribes before watch setup completes', async () => {
    const { service, client } = make();
    let resolve: (controller: AbortController) => void;
    mockWatch.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    const pending = service.watch(client, 'datauploads');
    service.unWatch(client, undefined, 'datauploads');
    const controller = new AbortController();
    resolve!(controller);
    await pending;
    expect(controller.signal.aborted).toBe(true);
  });

  it('isolates equal object names across plurals and cleans up every watch on disconnect', async () => {
    const { service, client } = make();
    const backup = new AbortController();
    const restore = new AbortController();
    mockWatch.mockResolvedValueOnce(backup).mockResolvedValueOnce(restore);
    await service.watch(client, 'backups', 'same');
    await service.watch(client, 'restores', 'same');
    expect(backup.signal.aborted).toBe(false);
    service.unWatch(client, 'same', 'backups');
    expect(backup.signal.aborted).toBe(true);
    expect(restore.signal.aborted).toBe(false);
    service.unWatchAll(client);
    expect(restore.signal.aborted).toBe(true);
  });

  it('reopens a closed Kubernetes stream from its latest revision without listing or polling', async () => {
    jest.useFakeTimers();
    const { service, client } = make();
    await service.watch(client, 'datauploads', undefined, '20');
    mockWatch.mock.calls[0][2]('MODIFIED', {
      metadata: { name: 'upload', resourceVersion: '21' },
    });
    mockWatch.mock.calls[0][3](null);
    await jest.advanceTimersByTimeAsync(1000);
    expect(mockWatch).toHaveBeenLastCalledWith(
      '/apis/velero.io/v2alpha1/namespaces/velero/datauploads',
      expect.objectContaining({ resourceVersion: '21' }),
      expect.any(Function),
      expect.any(Function)
    );
    expect(mockWatch).toHaveBeenCalledTimes(2);
    service.unWatchAll(client);
    await jest.advanceTimersByTimeAsync(5000);
    expect(mockWatch).toHaveBeenCalledTimes(2);
  });

  it.each([408, 429])(
    'retries transient HTTP %s from the latest revision and selector',
    async (code) => {
      jest.useFakeTimers();
      const { service, client } = make();
      await service.watch(
        client,
        'datauploads',
        undefined,
        '100',
        'velero.io/backup-name=daily'
      );
      mockWatch.mock.calls[0][2]('BOOKMARK', {
        metadata: { resourceVersion: '101' },
      });
      mockWatch.mock.calls[0][3]({ statusCode: code });
      expect(client.emit).not.toHaveBeenCalled();
      await jest.advanceTimersByTimeAsync(1000);
      expect(mockWatch).toHaveBeenCalledTimes(2);
      expect(mockWatch.mock.calls[1][1]).toMatchObject({
        resourceVersion: '101',
        labelSelector: 'velero.io/backup-name=daily',
      });
      mockWatch.mock.calls[1][2]('MODIFIED', {
        metadata: { resourceVersion: '102' },
      });
      expect(client.emit).toHaveBeenCalledWith(
        'watch:datauploads:MODIFIED',
        expect.objectContaining({ metadata: { resourceVersion: '102' } })
      );
      service.unWatchAll(client);
    }
  );

  it('backs off failures to thirty seconds, resets after activity and cancels pending retries', async () => {
    jest.useFakeTimers();
    const { service, client } = make();
    await service.watch(client, 'datauploads');
    for (const delay of [1000, 2000, 4000, 8000, 16000, 30000, 30000]) {
      const count = mockWatch.mock.calls.length;
      mockWatch.mock.calls[count - 1][3]({ statusCode: 503 });
      await jest.advanceTimersByTimeAsync(delay - 1);
      expect(mockWatch).toHaveBeenCalledTimes(count);
      await jest.advanceTimersByTimeAsync(1);
      expect(mockWatch).toHaveBeenCalledTimes(count + 1);
    }
    const latest = mockWatch.mock.calls.length - 1;
    mockWatch.mock.calls[latest][2]('BOOKMARK', {
      metadata: { resourceVersion: '200' },
    });
    mockWatch.mock.calls[latest][3]({ statusCode: 429 });
    await jest.advanceTimersByTimeAsync(1000);
    expect(mockWatch).toHaveBeenCalledTimes(latest + 2);
    mockWatch.mock.calls[latest + 1][3]({ statusCode: 408 });
    service.unWatchAll(client);
    await jest.advanceTimersByTimeAsync(60000);
    expect(mockWatch).toHaveBeenCalledTimes(latest + 2);
  });

  it('asks for a fresh snapshot when a revision expires and does not retry a forbidden stream', async () => {
    jest.useFakeTimers();
    const { service, client } = make();
    await service.watch(client, 'datauploads', undefined, 'old');
    mockWatch.mock.calls[0][2]('ERROR', { code: 410, reason: 'Expired' });
    expect(client.emit).toHaveBeenCalledWith('watch:datauploads:ERROR', {
      code: 410,
    });
    await service.watch(client, 'podvolumebackups');
    mockWatch.mock.calls[1][3]({ statusCode: 403 });
    expect(client.emit).toHaveBeenCalledWith('watch:podvolumebackups:ERROR', {
      code: 403,
    });
    await jest.advanceTimersByTimeAsync(5000);
    expect(mockWatch).toHaveBeenCalledTimes(2);
  });

  it('keeps another client and named detail streams alive when a legacy list unsubscribes', async () => {
    const { service, client } = make();
    const other = { id: 'other-viewer', emit: jest.fn() } as unknown as Socket;
    const list = new AbortController();
    const detail = new AbortController();
    const otherList = new AbortController();
    mockWatch
      .mockResolvedValueOnce(list)
      .mockResolvedValueOnce(detail)
      .mockResolvedValueOnce(otherList);
    await service.watch(client, 'datauploads');
    await service.watch(client, 'datauploads', 'upload');
    await service.watch(other, 'datauploads');
    service.unWatch(client);
    expect(list.signal.aborted).toBe(true);
    expect(detail.signal.aborted).toBe(false);
    expect(otherList.signal.aborted).toBe(false);
    service.unWatchAll(client);
    expect(detail.signal.aborted).toBe(true);
    expect(otherList.signal.aborted).toBe(false);
    service.unWatchAll(other);
  });

  it('ignores stale events and aborts late setup when a same-source watch is replaced', async () => {
    const { service, client } = make();
    let resolve: (controller: AbortController) => void;
    mockWatch.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    const pending = service.watch(client, 'datauploads', undefined, 'old');
    const latest = new AbortController();
    mockWatch.mockResolvedValueOnce(latest);
    await service.watch(client, 'datauploads', undefined, 'new');
    mockWatch.mock.calls[0][2]('MODIFIED', { metadata: { name: 'upload' } });
    expect(client.emit).not.toHaveBeenCalled();
    const stale = new AbortController();
    resolve!(stale);
    await pending;
    expect(stale.signal.aborted).toBe(true);
    expect(latest.signal.aborted).toBe(false);
    service.unWatchAll(client);
  });

  it('recovers from a transient setup failure and carries bookmark revisions without emitting rows', async () => {
    jest.useFakeTimers();
    const { service, client } = make();
    mockWatch.mockRejectedValueOnce({ statusCode: 503 });
    await service.watch(client, 'datauploads', undefined, '10');
    await jest.advanceTimersByTimeAsync(1000);
    expect(mockWatch).toHaveBeenCalledTimes(2);
    mockWatch.mock.calls[1][2]('BOOKMARK', {
      metadata: { resourceVersion: '11' },
    });
    expect(client.emit).not.toHaveBeenCalled();
    mockWatch.mock.calls[1][3](null);
    await jest.advanceTimersByTimeAsync(1000);
    expect(mockWatch.mock.calls[2][1].resourceVersion).toBe('11');
    service.unWatchAll(client);
    await jest.advanceTimersByTimeAsync(5000);
    expect(mockWatch).toHaveBeenCalledTimes(3);
  });
});

describe('native Kubernetes pagination', () => {
  const setup = () => {
    const api = {
      listNamespacedCustomObject: jest.fn().mockResolvedValue({
        items: [{ metadata: { name: 'first' } }],
        metadata: {
          continue: 'next-token',
          remainingItemCount: 9999,
          resourceVersion: '123',
        },
      }),
    };
    const service = new K8sCustomObjectService(
      { makeApiClient: () => api } as unknown as KubeConfig,
      { debug: jest.fn(), error: jest.fn() } as unknown as AppLogger,
      new ConfigService({ velero: { namespace: 'velero' } })
    );
    return { api, service };
  };
  it('passes limit and continuation to Kubernetes without fetching remaining chunks', async () => {
    const { api, service } = setup();
    const result = await lastValueFrom(
      service.getPage('datauploads', {
        limit: 20,
        continue: 'previous-token',
        labelSelector: 'velero.io/backup-name=daily',
      })
    );
    expect(api.listNamespacedCustomObject).toHaveBeenCalledTimes(1);
    expect(api.listNamespacedCustomObject).toHaveBeenCalledWith({
      group: 'velero.io',
      version: 'v2alpha1',
      namespace: 'velero',
      plural: 'datauploads',
      limit: 20,
      _continue: 'previous-token',
      labelSelector: 'velero.io/backup-name=daily',
      fieldSelector: undefined,
    });
    expect(result.items).toHaveLength(1);
    expect(result.metadata).toMatchObject({
      continue: 'next-token',
      remainingItemCount: 9999,
    });
  });
  it('always provides a bounded limit, including a legacy zero or excessive preference', async () => {
    const { api, service } = setup();
    await lastValueFrom(service.getPage('podvolumebackups', { limit: 0 }));
    expect(api.listNamespacedCustomObject).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 20 })
    );
    await lastValueFrom(service.getPage('podvolumebackups', { limit: 10000 }));
    expect(api.listNamespacedCustomObject).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 100 })
    );
  });
  it('preserves expiration errors instead of restarting or walking the collection', async () => {
    const { api, service } = setup();
    api.listNamespacedCustomObject.mockRejectedValue({
      code: 410,
      message: 'ResourceExpired',
    });
    await expect(
      lastValueFrom(
        service.getPage('podvolumebackups', { limit: 20, continue: 'expired' })
      )
    ).rejects.toMatchObject({ status: 410 });
    expect(api.listNamespacedCustomObject).toHaveBeenCalledTimes(1);
  });
});
