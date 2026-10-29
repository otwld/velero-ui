import { of, Subject, throwError } from 'rxjs';
import { PodVolumeListService } from './pod-volume-list.service';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';
import { Resources } from '@velero-ui/velero';
import {
  filterPodVolumeList,
  podVolumeListItem,
  type VolumeOperation,
} from '@velero-ui/shared-types';

jest.mock('../k8s-custom-object/k8s-custom-object.service', () => ({
  K8sCustomObjectService: class {},
}));
const volume = (name: string, kind = 'DataUpload') => ({
  kind,
  metadata: { name, uid: name, namespace: 'velero' },
  spec: {
    sourcePVC: 'data',
    sourceNamespace: 'app',
    backupStorageLocation: 'default',
  },
  status: { phase: 'InProgress', progress: { bytesDone: 1, totalBytes: 100 } },
});
function setup(count = 10000) {
  const transports = new Map<
    string,
    { id: string; emit: (event: string, value: unknown) => unknown }
  >();
  const objects = {
    get: jest.fn((plural) =>
      of({
        items:
          plural === 'datauploads'
            ? Array.from({ length: count }, (_, i) =>
                volume(`volume-${String(i).padStart(5, '0')}`)
              )
            : [],
        metadata: { resourceVersion: 'rv1' },
      })
    ),
    watch: jest.fn(async (client, plural) => {
      transports.set(plural, client);
    }),
    unWatch: jest.fn(),
  };
  const service = new PodVolumeListService(
    objects as unknown as K8sCustomObjectService
  );
  return { service, objects, transports };
}
const both = { filesystem: true, mover: true, restores: true };
describe('server mixed pod volume pagination', () => {
  afterEach(() => jest.useRealTimers());
  it('sends twenty of ten thousand rows and reuses source snapshots for another page', async () => {
    const { service, objects } = setup();
    const first = await service.get(true, { limit: 20 }, both);
    expect(first.items).toHaveLength(20);
    expect(first.total).toBe(10000);
    const next = await service.get(true, { limit: 20, offset: 20 }, both);
    expect(next.items[0].metadata.name).toBe('volume-00020');
    expect(objects.get).toHaveBeenCalledTimes(2);
    service.onModuleDestroy();
  });
  it('never interprets zero as unlimited and clamps excessive limits and offsets', async () => {
    const { service } = setup(150);
    expect((await service.get(true, { limit: 0 }, both)).items).toHaveLength(1);
    const page = await service.get(true, { limit: 1000, offset: 10000 }, both);
    expect(page.limit).toBe(100);
    expect(page.offset).toBe(100);
    expect(page.items).toHaveLength(50);
    service.onModuleDestroy();
  });
  it('keeps WS pages bounded and processes progress without relisting sources', async () => {
    jest.useFakeTimers();
    const { service, objects, transports } = setup();
    const client = { id: 'client', emit: jest.fn() };
    await service.subscribe(client, true, { limit: 20 }, both, 'request-1');
    transports.get('datauploads').emit('watch:datauploads:MODIFIED', {
      ...volume('volume-00000'),
      status: {
        phase: 'Completed',
        progress: { bytesDone: 100, totalBytes: 100 },
      },
    });
    await jest.advanceTimersByTimeAsync(50);
    const body = client.emit.mock.calls[client.emit.mock.calls.length - 1][1];
    expect(body.page.items).toHaveLength(20);
    expect(body.page.total).toBe(10000);
    expect(body.page.items[0].phase).toBe('Completed');
    expect(objects.get).toHaveBeenCalledTimes(2);
    service.onModuleDestroy();
  });
  it('constructs high-cardinality facets with linear property access', () => {
    let reads = 0;
    const items = Array.from({ length: 10000 }, (_, i) => ({
      ...podVolumeListItem(
        volume(String(i)) as VolumeOperation,
        Resources.DATA_UPLOAD
      ),
      get backupName() {
        reads++;
        return `backup-${i}`;
      },
    }));
    expect(
      filterPodVolumeList(items, { limit: 20 }).filters.backup
    ).toHaveLength(10000);
    expect(reads).toBeLessThan(500000);
  });
});

it('merges globally before filtering and sorting across filesystem and data mover pages', async () => {
  const { service, objects } = setup(0);
  (objects.get as jest.Mock).mockImplementation((plural) =>
    of({
      items:
        plural === 'datauploads'
          ? [volume('a'), volume('c')]
          : [
              {
                ...volume('b', 'PodVolumeBackup'),
                status: { phase: 'Completed' },
              },
            ],
      metadata: { resourceVersion: '1' },
    })
  );
  const page = await service.get(true, { limit: 2 }, both);
  expect(page.items.map((item) => item.metadata.name)).toEqual(['a', 'b']);
  expect(page.total).toBe(3);
  const filtered = await service.get(
    true,
    { limit: 20, search: 'app', status: 'InProgress' },
    both
  );
  expect(filtered.total).toBe(2);
  expect(objects.get).toHaveBeenCalledTimes(2);
  service.onModuleDestroy();
});

it.each([
  { filesystem: true, mover: false, restores: false },
  { filesystem: false, mover: true, restores: false },
])(
  'never loads or exposes an unauthorized source (%j)',
  async (permissions) => {
    const { service, objects } = setup(5);
    const page = await service.get(true, {}, permissions);
    expect(objects.get.mock.calls.map(([plural]) => plural)).toEqual([
      permissions.mover ? 'datauploads' : 'podvolumebackups',
    ]);
    expect(page.total).toBe(permissions.mover ? 5 : 0);
    await expect(
      service.get(true, {}, { filesystem: false, mover: false, restores: true })
    ).rejects.toThrow();
    service.onModuleDestroy();
  }
);

it('only enriches restores with separately authorized parent data', async () => {
  const { service, objects } = setup(0);
  (objects.get as jest.Mock).mockImplementation((plural) =>
    of({
      items:
        plural === 'restores'
          ? [
              {
                metadata: { name: 'restore', uid: 'restore-uid' },
                spec: { backupName: 'daily' },
              },
            ]
          : plural === 'datadownloads'
            ? [
                {
                  ...volume('download', 'DataDownload'),
                  metadata: {
                    name: 'download',
                    uid: 'du',
                    labels: {
                      'velero.io/restore-name': 'restore',
                      'velero.io/restore-uid': 'restore-uid',
                    },
                  },
                  spec: {
                    targetVolume: { pvc: 'data', namespace: 'restored' },
                  },
                },
              ]
            : [],
      metadata: { resourceVersion: '1' },
    })
  );
  const allowed = await service.get(
    false,
    {},
    { filesystem: false, mover: true, restores: true }
  );
  expect(allowed.items[0].backupName).toBe('daily');
  const restricted = await service.get(
    false,
    {},
    { filesystem: false, mover: true, restores: false }
  );
  expect(restricted.items[0].backupName).toBeUndefined();
  expect(restricted.items[0].namespace).toBe('restored');
  service.onModuleDestroy();
});

it.each([404, 403, 500])(
  'keeps independent rows while reporting real source failure %s',
  async (code) => {
    const { service, objects } = setup(0);
    (objects.get as jest.Mock).mockImplementation((plural) =>
      plural === 'datauploads'
        ? throwError(() => ({ code }))
        : of({
            items: [volume('fs', 'PodVolumeBackup')],
            metadata: { resourceVersion: '1' },
          })
    );
    const page = await service.get(true, {}, both);
    expect(page.total).toBe(1);
    expect(page.issues).toEqual(
      code === 404 ? [] : [{ plural: 'datauploads' }]
    );
    expect(JSON.stringify(page)).not.toContain('secret');
    service.onModuleDestroy();
  }
);

it('shares watches across browsers and coalesces bursts while preserving UID deletion guards', async () => {
  jest.useFakeTimers();
  const { service, objects, transports } = setup(10);
  const first = { id: 'a', emit: jest.fn() },
    second = { id: 'b', emit: jest.fn() };
  await service.subscribe(first, true, { limit: 2 }, both, 'a1');
  await service.subscribe(second, true, { limit: 3 }, both, 'b1');
  for (let i = 0; i < 100; i++)
    transports
      .get('datauploads')
      .emit('watch:datauploads:MODIFIED', volume('volume-00000'));
  transports.get('datauploads').emit('watch:datauploads:DELETED', {
    ...volume('volume-00000'),
    metadata: { name: 'volume-00000', namespace: 'velero', uid: 'old' },
  });
  await jest.advanceTimersByTimeAsync(50);
  expect(first.emit).toHaveBeenCalledTimes(2);
  expect(second.emit).toHaveBeenCalledTimes(2);
  expect(first.emit.mock.calls[1][1].page.total).toBe(10);
  expect(objects.watch).toHaveBeenCalledTimes(2);
  transports
    .get('datauploads')
    .emit('watch:datauploads:DELETED', volume('volume-00000'));
  await jest.advanceTimersByTimeAsync(50);
  expect(first.emit.mock.calls[2][1].page.total).toBe(9);
  expect(objects.get).toHaveBeenCalledTimes(2);
  service.onModuleDestroy();
});

it('cleans cache streams after idle TTL while active subscribers retain them', async () => {
  jest.useFakeTimers();
  const { service, objects } = setup(0);
  const client = { id: 'a', emit: jest.fn() };
  await service.subscribe(client, true, {}, both, '1');
  await jest.advanceTimersByTimeAsync(31000);
  expect(objects.unWatch).not.toHaveBeenCalled();
  service.disconnect(client);
  await jest.advanceTimersByTimeAsync(29999);
  expect(objects.unWatch).not.toHaveBeenCalled();
  await jest.advanceTimersByTimeAsync(1);
  expect(objects.unWatch).toHaveBeenCalledTimes(2);
  await service.get(true, {}, both);
  expect(objects.get).toHaveBeenCalledTimes(4);
  service.onModuleDestroy();
});

it('resnapshots only an expired source and clears forbidden data', async () => {
  jest.useFakeTimers();
  const { service, objects, transports } = setup(5);
  const client = { id: 'a', emit: jest.fn() };
  await service.subscribe(client, true, {}, both, '1');
  transports.get('datauploads').emit('watch:datauploads:ERROR', { code: 410 });
  await jest.advanceTimersByTimeAsync(50);
  expect(objects.get).toHaveBeenCalledTimes(3);
  expect(
    client.emit.mock.calls[client.emit.mock.calls.length - 1][1].page.total
  ).toBe(5);
  transports.get('datauploads').emit('watch:datauploads:ERROR', { code: 403 });
  await jest.advanceTimersByTimeAsync(50);
  expect(
    client.emit.mock.calls[client.emit.mock.calls.length - 1][1].page
  ).toMatchObject({ total: 0, issues: [{ plural: 'datauploads' }] });
  await service.get(true, {}, both);
  expect(objects.get).toHaveBeenCalledTimes(4);
  service.onModuleDestroy();
});

it('never emits late or superseded subscription responses and ignores late source loads after destruction', async () => {
  const { service, objects } = setup(0);
  const pending = new Subject<{
    items: [];
    metadata: { resourceVersion: string };
  }>();
  (objects.get as jest.Mock).mockReturnValue(pending.asObservable());
  const client = { id: 'a', emit: jest.fn() };
  const first = service.subscribe(client, true, {}, both, 'old');
  const second = service.subscribe(client, true, {}, both, 'new');
  pending.next({ items: [], metadata: { resourceVersion: '1' } });
  pending.complete();
  await Promise.all([first, second]);
  expect(client.emit).toHaveBeenCalledTimes(1);
  expect(client.emit.mock.calls[0][1].requestId).toBe('new');
  service.disconnect(client);
  service.onModuleDestroy();
  const another = setup(0);
  const late = new Subject<{
    items: [];
    metadata: { resourceVersion: string };
  }>();
  (another.objects.get as jest.Mock).mockReturnValue(late.asObservable());
  const active = another.service.subscribe(client, true, {}, both, 'late');
  another.service.onModuleDestroy();
  late.next({ items: [], metadata: { resourceVersion: '1' } });
  late.complete();
  await active;
  expect(another.objects.watch).not.toHaveBeenCalled();
  expect(client.emit).toHaveBeenCalledTimes(1);
});

it('isolates disjoint users even when both sources are already warm', async () => {
  const { service, objects } = setup(0);
  (objects.get as jest.Mock).mockImplementation((plural) =>
    of({
      items: [
        volume(
          plural,
          plural === 'datauploads' ? 'DataUpload' : 'PodVolumeBackup'
        ),
      ],
      metadata: { resourceVersion: '1' },
    })
  );
  expect((await service.get(true, {}, both)).total).toBe(2);
  const fs = await service.get(
    true,
    {},
    { filesystem: true, mover: false, restores: false }
  );
  const mover = await service.get(
    true,
    {},
    { filesystem: false, mover: true, restores: false }
  );
  expect(fs.items.map((item) => item.resource.plural)).toEqual([
    'podvolumebackups',
  ]);
  expect(mover.items.map((item) => item.resource.plural)).toEqual([
    'datauploads',
  ]);
  expect(objects.get).toHaveBeenCalledTimes(2);
  service.onModuleDestroy();
});

it('suppresses disconnected requests while shared source loading finishes and expires normally', async () => {
  jest.useFakeTimers();
  const { service, objects } = setup(0);
  const pending = new Subject<{
    items: [];
    metadata: { resourceVersion: string };
  }>();
  (objects.get as jest.Mock).mockReturnValue(pending.asObservable());
  const client = { id: 'disconnected', emit: jest.fn() };
  const request = service.subscribe(client, true, {}, both, 'late');
  service.disconnect(client);
  pending.next({ items: [], metadata: { resourceVersion: '1' } });
  pending.complete();
  await request;
  await jest.advanceTimersByTimeAsync(50);
  expect(client.emit).not.toHaveBeenCalled();
  await jest.advanceTimersByTimeAsync(30000);
  expect(objects.unWatch).toHaveBeenCalledTimes(2);
  service.onModuleDestroy();
});

it('clamps the current server page after deletion empties the last page', async () => {
  jest.useFakeTimers();
  const { service, transports } = setup(21);
  const client = { id: 'page', emit: jest.fn() };
  await service.subscribe(
    client,
    true,
    { offset: 20, limit: 20 },
    both,
    'current'
  );
  transports
    .get('datauploads')
    .emit('watch:datauploads:DELETED', volume('volume-00020'));
  await jest.advanceTimersByTimeAsync(50);
  const page =
    client.emit.mock.calls[client.emit.mock.calls.length - 1][1].page;
  expect(page.offset).toBe(0);
  expect(page.total).toBe(20);
  expect(page.items).toHaveLength(20);
  service.onModuleDestroy();
});

it('recovers an expired watch after a transient snapshot failure without browser refresh', async () => {
  jest.useFakeTimers();
  const { service, objects, transports } = setup(1);
  const client = { id: 'recovery', emit: jest.fn() };
  await service.subscribe(client, true, {}, both, 'current');
  objects.get.mockImplementationOnce(() => throwError(() => ({ code: 503 })));
  transports.get('datauploads').emit('watch:datauploads:ERROR', { code: 410 });
  await jest.advanceTimersByTimeAsync(50);
  expect(objects.get).toHaveBeenCalledTimes(3);
  expect(client.emit.mock.calls.at(-1)[1].page.issues).toEqual([
    { plural: 'datauploads' },
  ]);
  await jest.advanceTimersByTimeAsync(1100);
  expect(objects.get).toHaveBeenCalledTimes(4);
  expect(objects.watch).toHaveBeenCalledTimes(3);
  expect(client.emit.mock.calls.at(-1)[1].page.issues).toEqual([]);
  service.onModuleDestroy();
});

it.each([403, 404])(
  'does not retry a terminal snapshot failure %s',
  async (code) => {
    jest.useFakeTimers();
    const { service, objects } = setup(0);
    objects.get.mockImplementation(() => throwError(() => ({ code })));
    await service.subscribe(
      { id: 'terminal', emit: jest.fn() },
      true,
      {},
      { filesystem: false, mover: true, restores: false },
      '1'
    );
    await jest.advanceTimersByTimeAsync(120000);
    expect(objects.get).toHaveBeenCalledTimes(1);
    service.onModuleDestroy();
  }
);

it('backs off transient snapshot retries with a bounded delay and stops after recovery', async () => {
  jest.useFakeTimers();
  const { service, objects } = setup(0);
  objects.get.mockImplementation(() => throwError(() => ({ code: 503 })));
  await service.subscribe(
    { id: 'backoff', emit: jest.fn() },
    true,
    {},
    { filesystem: false, mover: true, restores: false },
    '1'
  );
  let calls = 1;
  for (const delay of [1000, 2000, 4000, 8000, 16000, 30000, 30000]) {
    await jest.advanceTimersByTimeAsync(delay - 1);
    expect(objects.get).toHaveBeenCalledTimes(calls);
    await jest.advanceTimersByTimeAsync(1);
    expect(objects.get).toHaveBeenCalledTimes(++calls);
  }
  objects.get.mockImplementation(() =>
    of({ items: [], metadata: { resourceVersion: 'recovered' } })
  );
  await jest.advanceTimersByTimeAsync(30000);
  expect(objects.get).toHaveBeenCalledTimes(++calls);
  expect(objects.watch).toHaveBeenCalledTimes(1);
  await jest.advanceTimersByTimeAsync(120000);
  expect(objects.get).toHaveBeenCalledTimes(calls);
  service.onModuleDestroy();
});

it.each(['disconnect', 'destroy'])(
  'cancels scheduled recovery on %s, including idle cache expiry',
  async (action) => {
    jest.useFakeTimers();
    const { service, objects } = setup(0);
    objects.get.mockImplementation(() => throwError(() => ({ code: 503 })));
    const client = { id: 'closed', emit: jest.fn() };
    await service.subscribe(
      client,
      true,
      {},
      { filesystem: false, mover: true, restores: false },
      '1'
    );
    if (action === 'destroy') service.onModuleDestroy();
    else service.disconnect(client);
    await jest.advanceTimersByTimeAsync(120000);
    expect(objects.get).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
    service.onModuleDestroy();
  }
);

it('shares a manual recovery load and cancels the obsolete retry timer', async () => {
  jest.useFakeTimers();
  const { service, objects } = setup(0);
  objects.get.mockImplementationOnce(() => throwError(() => ({ code: 503 })));
  const permissions = { filesystem: false, mover: true, restores: false };
  await service.subscribe(
    { id: 'shared', emit: jest.fn() },
    true,
    {},
    permissions,
    '1'
  );
  const pending = new Subject<{
    items: [];
    metadata: { resourceVersion: string };
  }>();
  objects.get.mockImplementation(() => pending.asObservable());
  const first = service.get(true, {}, permissions);
  const second = service.get(true, {}, permissions);
  await jest.advanceTimersByTimeAsync(1500);
  expect(objects.get).toHaveBeenCalledTimes(2);
  pending.next({ items: [], metadata: { resourceVersion: 'fresh' } });
  pending.complete();
  await Promise.all([first, second]);
  await jest.advanceTimersByTimeAsync(60000);
  expect(objects.get).toHaveBeenCalledTimes(2);
  expect(objects.watch).toHaveBeenCalledTimes(1);
  service.onModuleDestroy();
});
