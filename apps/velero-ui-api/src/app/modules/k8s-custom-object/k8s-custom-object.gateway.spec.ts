import 'reflect-metadata';
import { Socket } from 'socket.io';
import { K8sCustomObjectGateway } from './k8s-custom-object.gateway';
import { K8sCustomObjectService } from './k8s-custom-object.service';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { AuthService } from '../auth/auth.service';

jest.mock('./k8s-custom-object.service', () => ({
  K8sCustomObjectService: class {},
}));
jest.mock('../../shared/guards/ws-jwt-auth.guard', () => ({
  WsJwtAuthGuard: class {},
}));
jest.mock('../auth/auth.service', () => ({ AuthService: class {} }));

function gateway(noAuth = false) {
  const objects = {
    watch: jest.fn(),
    unWatch: jest.fn(),
    unWatchAll: jest.fn(),
  };
  const can = jest.fn((_, plural) => plural === 'podvolumebackups');
  const createForUser = jest.fn(() => ({ can }));
  const result = new K8sCustomObjectGateway(
    objects as unknown as K8sCustomObjectService,
    { createForUser } as unknown as CaslAbilityFactory,
    { noAuthRequired: () => noAuth } as AuthService
  );
  return { result, objects, createForUser };
}

describe('volume stream authorization and cleanup', () => {
  it('authorizes each requested source independently', () => {
    const { result, objects } = gateway();
    const client = { id: 'viewer', data: { user: {} } } as Socket;
    result.watchOn(client, undefined, 'podvolumebackups', '10');
    expect(objects.watch).toHaveBeenCalledWith(
      client,
      'podvolumebackups',
      undefined,
      '10'
    );
    expect(() =>
      result.watchOn(client, undefined, 'datauploads', '20')
    ).toThrow('Access denied');
    expect(objects.watch).toHaveBeenCalledTimes(1);
  });

  it('supports explicitly configured public mode without a JWT user', () => {
    const { result, objects, createForUser } = gateway(true);
    const client = { id: 'public', data: {} } as Socket;
    result.watchOn(client, undefined, 'datauploads', '20');
    expect(objects.watch).toHaveBeenCalledWith(
      client,
      'datauploads',
      undefined,
      '20'
    );
    expect(createForUser).not.toHaveBeenCalled();
  });

  it('scopes unsubscribe to one plural but closes every subscription on disconnect', () => {
    const { result, objects } = gateway();
    const client = { id: 'viewer' } as Socket;
    result.watchOff(client, undefined, 'datauploads');
    expect(objects.unWatch).toHaveBeenCalledWith(
      client,
      undefined,
      'datauploads'
    );
    result.handleDisconnect(client);
    expect(objects.unWatchAll).toHaveBeenCalledWith(client);
  });
});
