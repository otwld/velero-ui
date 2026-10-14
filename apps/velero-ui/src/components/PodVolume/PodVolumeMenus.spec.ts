import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter, RouterView } from 'vue-router';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Resources } from '@velero-ui/velero';
import { useListStore } from '@velero-ui-app/stores/list.store';
import { Pages } from '@velero-ui-app/utils/constants.utils';
import PodVolumeBackupList from '@velero-ui-app/views/list/PodVolumeBackupList.vue';
import PodVolumeRestoreList from '@velero-ui-app/views/list/PodVolumeRestoreList.vue';
import PodVolume from '@velero-ui-app/views/resources/PodVolume.vue';
import {
  upload,
  download,
  filesystem,
} from '@velero-ui-app/utils/pod-volume-list.fixtures';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  createI18n: () => ({ global: { t: (key: string) => key } }),
}));

async function app(path: string) {
  const pinia = createPinia();
  const client = new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity, retry: false } },
  });
  const restoredFS = {
    ...filesystem,
    kind: 'PodVolumeRestore',
    metadata: {
      name: 'restored-filesystem',
      uid: 'restore-fs-uid',
      labels: { 'velero.io/restore-name': 'restore' },
    },
    spec: { ...filesystem.spec, pod: { name: 'pod', namespace: 'restored' } },
  };
  const get = vi.fn().mockImplementation((route: string) => {
    const lists = {
      '/pod-volume-backups': [filesystem],
      '/data-uploads': [upload],
      '/podvolumerestores': [restoredFS],
      '/data-downloads': [download],
      '/restores': [
        {
          metadata: { name: 'restore', uid: 'restore-uid' },
          spec: { backupName: 'daily' },
        },
      ],
    };
    if (lists[route])
      return Promise.resolve({
        data: {
          items: lists[route],
          total: lists[route].length,
          metadata: {},
          filters: {},
        },
      });
    if (route.startsWith('/data-uploads/'))
      return Promise.resolve({
        data: {
          ...upload,
          metadata: { ...upload.metadata, name: route.split('/').at(-1) },
        },
      });
    if (route.startsWith('/data-downloads/'))
      return Promise.resolve({ data: download });
    throw new Error(`Unexpected request: ${route}`);
  });
  const io = { emit: vi.fn(), on: vi.fn(), off: vi.fn() };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: Pages.POD_VOLUME_BACKUPS.path,
        name: Pages.POD_VOLUME_BACKUPS.name,
        component: PodVolumeBackupList,
      },
      {
        path: Pages.POD_VOLUME_RESTORES.path,
        name: Pages.POD_VOLUME_RESTORES.name,
        component: PodVolumeRestoreList,
      },
      { ...Pages.POD_VOLUME_BACKUP, component: PodVolume },
      { ...Pages.POD_VOLUME_RESTORE, component: PodVolume },
      { ...Pages.BACKUP, component: { template: '<div />' } },
      { ...Pages.RESTORE, component: { template: '<div />' } },
      { ...Pages.STORAGE_LOCATION, component: { template: '<div />' } },
    ],
  });
  await router.push(path);
  await router.isReady();
  const wrapper = mount(RouterView, {
    global: {
      plugins: [pinia, router, [VueQueryPlugin, { queryClient: client }]],
      provide: {
        axios: { get },
        socketIo: { io },
        config: { noAuthRequired: true },
      },
      stubs: { SearchFilter: true, SearchName: true, ResourceManifest: true },
      directives: { 'copy-to-clipboard': {} },
    },
  });
  const store = useListStore(pinia);
  // Production list route guards set the resource before creating page components.
  // The mixed menu query is supplied to every shared list component, so no legacy query runs.
  store.setObjectType(
    path.includes('/restores')
      ? Resources.POD_VOLUME_RESTORE
      : Resources.POD_VOLUME_BACKUP
  );
  await flushPromises();
  return {
    wrapper,
    get,
    io,
    store,
    router,
    close() {
      wrapper.unmount();
      client.clear();
    },
  };
}

beforeEach(() => localStorage.clear());

describe('dedicated pod volume menus', () => {
  it('renders filesystem backups and uploads, links mover details, and only selects filesystem resources', async () => {
    const instance = await app('/pod-volumes/backups');
    const rows = instance.wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);
    expect(instance.wrapper.text()).toContain('app/database');
    expect(
      instance.wrapper
        .find('a[href="/pod-volumes/backups/upload?resource=datauploads"]')
        .exists()
    ).toBe(true);
    expect(instance.store.total).toBe(2);
    await instance.wrapper.get('#checkbox-all').trigger('click');
    expect([...instance.store.checkedItems]).toEqual(['filesystem']);
    const mover = rows.find((row) => row.text().includes('upload'));
    expect(
      mover.get('input[type="checkbox"]').attributes('disabled')
    ).toBeDefined();
    expect(mover.find('button').exists()).toBe(false);
    expect(instance.get).toHaveBeenCalledTimes(2);
    expect(instance.io.emit).not.toHaveBeenCalled();
    instance.close();
  });
  it('renders restores and downloads with target PVC, parent restore and original backup', async () => {
    const instance = await app('/pod-volumes/restores');
    expect(instance.wrapper.findAll('tbody tr')).toHaveLength(2);
    expect(instance.wrapper.text()).toContain('restored/database');
    expect(instance.wrapper.find('a[href="/restores/restore"]').exists()).toBe(
      true
    );
    expect(instance.wrapper.find('a[href="/backups/daily"]').exists()).toBe(
      true
    );
    expect(
      instance.wrapper
        .find('a[href="/pod-volumes/restores/download?resource=datadownloads"]')
        .exists()
    ).toBe(true);
    expect(instance.store.total).toBe(2);
    expect(instance.get).toHaveBeenCalledTimes(3);
    instance.close();
  });
  it('refreshes both sources and paginates the combined result without extra requests', async () => {
    const instance = await app('/pod-volumes/backups');
    const refresh = instance.wrapper
      .findAll('button')
      .find((button) => button.text().includes('global.button.refresh.title'));
    await refresh.trigger('click');
    await flushPromises();
    expect(instance.get).toHaveBeenCalledTimes(4);
    instance.store.setLimit(1);
    await flushPromises();
    expect(instance.wrapper.findAll('tbody tr')).toHaveLength(1);
    instance.store.next();
    await flushPromises();
    expect(instance.wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(instance.wrapper.find('tbody').text()).toContain('upload');
    expect(instance.store.total).toBe(2);
    expect(instance.get).toHaveBeenCalledTimes(4);
    instance.close();
  });
  it('loads mover details from the correct APIs and reloads when switching from upload to download', async () => {
    const instance = await app(
      '/pod-volumes/backups/upload?resource=datauploads'
    );
    expect(instance.get).toHaveBeenCalledWith('/data-uploads/upload');
    expect(instance.wrapper.text()).toContain('app/database');
    expect(instance.io.emit).toHaveBeenCalledWith('watch:on', {
      name: 'upload',
      plural: 'datauploads',
    });
    await instance.router.push(
      '/pod-volumes/restores/download?resource=datadownloads'
    );
    await flushPromises();
    expect(instance.get).toHaveBeenCalledWith('/data-downloads/download');
    expect(instance.wrapper.text()).toContain('restored/database');
    expect(instance.io.emit).toHaveBeenCalledWith('watch:on', {
      name: 'download',
      plural: 'datadownloads',
    });
    expect(
      instance.get.mock.calls.some(
        ([route]) =>
          route.startsWith('/pod-volume-backups/') ||
          route.startsWith('/podvolumerestores/')
      )
    ).toBe(false);
    instance.close();
  });
});
