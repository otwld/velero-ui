import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, nextTick, ref } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateBackupTypeEnum } from '@velero-ui/shared-types';
import { useFormStore } from '@velero-ui-app/stores/form.store';
import { useKubernetesCreateObject } from '@velero-ui-app/composables/useKubernetesCreateObject';
import BackupFormCreate from './BackupFormCreate.vue';

vi.mock('@velero-ui-app/composables/useKubernetesCreateObject');
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

describe('BackupFormCreate', () => {
  const mutate = vi.fn();

  beforeEach(() => {
    setActivePinia(createPinia());
    mutate.mockReset();
    vi.mocked(useKubernetesCreateObject).mockReturnValue({
      mutate,
      isPending: ref(false),
      isError: ref(false),
      isSuccess: ref(false),
    } as ReturnType<typeof useKubernetesCreateObject>);
  });

  it('includes snapshotVolumes when it is false', async () => {
    useFormStore().formContent = [
      { type: CreateBackupTypeEnum.FROM_SCRATCH },
      {
        name: 'backup',
        ttl: { value: '1', unit: 'h' },
        storageLocation: 'default',
        snapshotMoveData: false,
        snapshotVolumes: false,
        defaultVolumesToFsBackup: false,
        volumeSnapshotLocations: [],
        includedNamespaces: [],
        excludedNamespaces: [],
        datamover: '',
        parallelFilesUpload: '',
      },
      {
        resourcePolicy: '',
        includeClusterResources: false,
        includeNamespaceClusterResources: true,
        includedClusterScopedResources: [],
        excludedClusterScopedResources: [],
        includedNamespaceScopedResources: [],
        excludedNamespaceScopedResources: [],
      },
      { labels: {}, labelsSelector: {} },
    ];

    const wrapper = shallowMount(BackupFormCreate, {
      global: {
        stubs: {
          Form: defineComponent({
            emits: ['onSubmit'],
            template: '<button @click="$emit(\'onSubmit\')">Submit</button>',
          }),
        },
      },
    });

    await wrapper.get('button').trigger('click');
    await nextTick();

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        spec: expect.objectContaining({ snapshotVolumes: false }),
      }),
    );
  });
});
