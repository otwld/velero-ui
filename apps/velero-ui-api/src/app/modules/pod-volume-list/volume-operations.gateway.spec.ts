import 'reflect-metadata';
import { Socket } from 'socket.io';
import { VolumeOperationsGateway } from './volume-operations.gateway';
import { VolumeOperationsController } from './volume-operations.controller';
import { VolumeOperationsService } from './volume-operations.service';
import { AuthService } from '../auth/auth.service';
import {
  CaslAbilityFactory,
  AppAbility,
} from '../../shared/modules/casl/casl-ability.factory';

jest.mock('../k8s-custom-object/k8s-custom-object.service', () => ({
  K8sCustomObjectService: class {},
}));
jest.mock('../auth/auth.service', () => ({ AuthService: class {} }));
jest.mock('../../shared/modules/casl/casl-ability.factory', () => ({
  CaslAbilityFactory: class {},
}));
jest.mock('../../shared/guards/ws-jwt-auth.guard', () => ({
  WsJwtAuthGuard: class {},
}));
function context() {
  const operations = {
    get: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    disconnect: jest.fn(),
  };
  const ability = { can: jest.fn((_, plural) => plural === 'datauploads') };
  const auth = { noAuthRequired: jest.fn(() => false) };
  const factory = { createForUser: jest.fn(() => ability) };
  const client = {
    id: 'socket',
    data: { user: {} },
    emit: jest.fn(),
  } as unknown as Socket;
  return {
    operations,
    ability,
    auth,
    client,
    controller: new VolumeOperationsController(
      operations as unknown as VolumeOperationsService,
      auth as unknown as AuthService
    ),
    gateway: new VolumeOperationsGateway(
      operations as unknown as VolumeOperationsService,
      factory as unknown as CaslAbilityFactory,
      auth as unknown as AuthService
    ),
  };
}
it('authorizes each HTTP source and explicitly disabled auth', () => {
  const { controller, operations, ability, auth } = context();
  controller.get(
    { plural: 'datauploads', parent: 'daily' },
    { uid: 'uid' },
    { ability: ability as unknown as AppAbility }
  );
  expect(operations.get).toHaveBeenCalledWith('datauploads', 'daily', 'uid');
  expect(() =>
    controller.get(
      { plural: 'podvolumebackups', parent: 'daily' },
      {},
      { ability: ability as unknown as AppAbility }
    )
  ).toThrow();
  auth.noAuthRequired.mockReturnValue(true);
  controller.get({ plural: 'podvolumebackups', parent: 'daily' }, {}, {});
  expect(operations.get).toHaveBeenCalledTimes(2);
});
it.each([
  null,
  {},
  { plural: 'backups', parent: 'daily', requestId: 'id' },
  { plural: 'datauploads', parent: 'bad/name', requestId: 'id' },
  { plural: 'datauploads', parent: 'daily', requestId: 'id', secret: 'leak' },
])('rejects malformed WS input %j', async (body) => {
  const { gateway, client, operations } = context();
  await gateway.watch(client, body);
  expect(operations.subscribe).not.toHaveBeenCalled();
  expect(client.emit).toHaveBeenCalledWith(
    'volume-operations:event',
    expect.objectContaining({ phase: 'ERROR', code: 400 })
  );
});
it('reauthorizes WS updates and scopes unsubscribe and disconnect', async () => {
  const { gateway, client, operations, ability } = context();
  const body = {
    plural: 'datauploads',
    parent: 'daily',
    requestId: 'id',
    version: '10',
  };
  await gateway.watch(client, body);
  expect(operations.subscribe).toHaveBeenCalledWith(
    client,
    expect.objectContaining(body)
  );
  ability.can.mockReturnValue(false);
  await gateway.watch(client, body);
  expect(operations.subscribe).toHaveBeenCalledTimes(1);
  expect(client.emit).toHaveBeenCalledWith('volume-operations:event', {
    requestId: 'id',
    phase: 'ERROR',
    code: 403,
  });
  gateway.unwatch(client, { requestId: 'other' });
  expect(operations.unsubscribe).toHaveBeenLastCalledWith(client, 'other');
  gateway.handleDisconnect(client);
  expect(operations.disconnect).toHaveBeenCalledWith(client);
});
