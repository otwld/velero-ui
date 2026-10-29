import { of } from 'rxjs';
import { VolumeOperationsService } from './volume-operations.service';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';

jest.mock('../k8s-custom-object/k8s-custom-object.service', () => ({
  K8sCustomObjectService: class {},
}));
function setup() {
  const objects = {
    getPage: jest.fn(),
    watch: jest.fn().mockResolvedValue(undefined),
    unWatchAll: jest.fn(),
  };
  const service = new VolumeOperationsService(
    objects as unknown as K8sCustomObjectService
  );
  return { objects, service };
}
it('reads only parent-selected Kubernetes pages and removes stale parent UIDs', async () => {
  const { objects, service } = setup();
  objects.getPage
    .mockReturnValueOnce(
      of({
        items: [
          {
            metadata: {
              name: 'old',
              labels: { 'velero.io/backup-uid': 'old' },
            },
          },
        ],
        metadata: { continue: 'next', resourceVersion: '10' },
      })
    )
    .mockReturnValueOnce(
      of({
        items: [
          {
            metadata: {
              name: 'current',
              labels: { 'velero.io/backup-uid': 'uid' },
            },
          },
        ],
        metadata: { resourceVersion: '10' },
      })
    );
  const page = await service.get('datauploads', 'daily', 'uid');
  expect(page.items.map((item) => item.metadata.name)).toEqual(['current']);
  expect(page.metadata.resourceVersion).toBe('10');
  expect(objects.getPage.mock.calls).toEqual([
    [
      'datauploads',
      {
        limit: 100,
        labelSelector: 'velero.io/backup-name=daily',
        continue: undefined,
      },
    ],
    [
      'datauploads',
      {
        limit: 100,
        labelSelector: 'velero.io/backup-name=daily',
        continue: 'next',
      },
    ],
  ]);
});
it('hashes long names, keeps legacy objects, and isolates exact watch cleanup', async () => {
  const { objects, service } = setup();
  objects.getPage.mockReturnValue(of({ items: [], metadata: {} }));
  await service.get('podvolumerestores', 'x'.repeat(70));
  expect(objects.getPage.mock.calls[0][1].labelSelector).toMatch(
    /^velero.io\/restore-name=x{57}[a-f0-9]{6}$/
  );
  const client = { id: 'socket', emit: jest.fn() };
  await service.subscribe(client, {
    plural: 'datauploads',
    parent: 'daily',
    uid: 'uid',
    version: '10',
    requestId: 'a',
  });
  await service.subscribe(client, {
    plural: 'datauploads',
    parent: 'other',
    requestId: 'b',
  });
  const adapter = objects.watch.mock.calls[0][0];
  expect(objects.watch.mock.calls[0].slice(1)).toEqual([
    'datauploads',
    undefined,
    '10',
    'velero.io/backup-name=daily',
  ]);
  adapter.emit('watch:datauploads:MODIFIED', {
    metadata: { labels: { 'velero.io/backup-uid': 'old' } },
  });
  expect(client.emit).not.toHaveBeenCalled();
  adapter.emit('watch:datauploads:MODIFIED', { metadata: { name: 'legacy' } });
  expect(client.emit).toHaveBeenCalledWith('volume-operations:event', {
    requestId: 'a',
    phase: 'MODIFIED',
    object: { metadata: { name: 'legacy' } },
  });
  service.unsubscribe(client, 'a');
  adapter.emit('watch:datauploads:MODIFIED', { metadata: { name: 'late' } });
  expect(client.emit).toHaveBeenCalledTimes(1);
  expect(objects.unWatchAll).toHaveBeenCalledWith(adapter);
  service.disconnect(client);
  expect(objects.unWatchAll).toHaveBeenCalledTimes(2);
});
it('rejects unsupported plurals without Kubernetes calls', async () => {
  const { service, objects } = setup();
  await expect(service.get('restores', 'daily')).rejects.toThrow();
  expect(objects.getPage).not.toHaveBeenCalled();
});
it('cancels a pending watch before its async open completes', async () => {
  const { service, objects } = setup();
  let resolve: () => void;
  objects.watch.mockImplementation(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      })
  );
  const client = { id: 'pending', emit: jest.fn() };
  const pending = service.subscribe(client, {
    plural: 'podvolumebackups',
    parent: 'daily',
    requestId: 'id',
  });
  service.disconnect(client);
  const adapter = objects.watch.mock.calls[0][0];
  adapter.emit('watch:podvolumebackups:ERROR', { code: 410 });
  resolve();
  await pending;
  expect(objects.unWatchAll).toHaveBeenCalledWith(adapter);
  expect(client.emit).not.toHaveBeenCalled();
});
