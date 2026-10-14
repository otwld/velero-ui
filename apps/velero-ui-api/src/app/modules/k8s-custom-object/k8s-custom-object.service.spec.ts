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
