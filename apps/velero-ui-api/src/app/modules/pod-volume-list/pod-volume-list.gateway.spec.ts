import 'reflect-metadata';
import { Socket } from 'socket.io';
import { PodVolumeListController } from './pod-volume-list.controller';
import { PodVolumeListGateway } from './pod-volume-list.gateway';
import { PodVolumeListService } from './pod-volume-list.service';
import { AuthService } from '../auth/auth.service';
import {
  CaslAbilityFactory,
  type AppAbility,
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
  const lists = {
    get: jest.fn().mockResolvedValue({ items: [] }),
    subscribe: jest.fn().mockResolvedValue(undefined),
    unsubscribe: jest.fn(),
    disconnect: jest.fn(),
  };
  const ability = { can: jest.fn((_, plural) => plural === 'datauploads') };
  const abilities = { createForUser: jest.fn(() => ability) };
  const auth = { noAuthRequired: jest.fn(() => false) };
  const client = {
    id: 'browser',
    data: { user: { sub: 'user' } },
    emit: jest.fn(),
  } as unknown as Socket;
  return {
    lists,
    ability,
    auth,
    client,
    gateway: new PodVolumeListGateway(
      lists as unknown as PodVolumeListService,
      abilities as unknown as CaslAbilityFactory,
      auth as unknown as AuthService
    ),
    controller: new PodVolumeListController(
      lists as unknown as PodVolumeListService,
      auth as unknown as AuthService
    ),
  };
}
it('checks filesystem OR mover permission independently for HTTP and excludes unauthorized parents', async () => {
  const { controller, lists, ability } = context();
  await controller.backups({}, { ability: ability as unknown as AppAbility });
  expect(lists.get).toHaveBeenCalledWith(
    true,
    {},
    { filesystem: false, mover: true, restores: false }
  );
  ability.can.mockImplementation((_, plural) => plural === 'datadownloads');
  await controller.restores({}, { ability: ability as unknown as AppAbility });
  expect(lists.get).toHaveBeenLastCalledWith(
    false,
    {},
    { filesystem: false, mover: true, restores: false }
  );
  ability.can.mockReturnValue(false);
  expect(() =>
    controller.backups({}, { ability: ability as unknown as AppAbility })
  ).toThrow();
});
it('allows all sources only when authentication is explicitly disabled', async () => {
  const { controller, lists, auth } = context();
  auth.noAuthRequired.mockReturnValue(true);
  await controller.restores({}, {});
  expect(lists.get).toHaveBeenCalledWith(
    false,
    {},
    { filesystem: true, mover: true, restores: true }
  );
});
it.each([
  null,
  {},
  { backup: 'true', search: {}, requestId: 'id' },
  { backup: true, search: [], requestId: 'id' },
  { backup: true, search: { limit: 'bad' }, requestId: 'id' },
  { backup: true, search: {}, requestId: '' },
  { backup: true, search: {}, requestId: 'id', injected: 'secret' },
  { backup: true, search: { badField: 'secret' }, requestId: 'id' },
])('rejects malformed websocket payload safely (%j)', async (body) => {
  const { gateway, client, lists } = context();
  await gateway.watch(client, body);
  expect(lists.subscribe).not.toHaveBeenCalled();
  expect(client.emit).toHaveBeenCalledWith(
    'pod-volumes:error',
    expect.objectContaining({ code: 400 })
  );
  expect(JSON.stringify((client.emit as jest.Mock).mock.calls)).not.toContain(
    'secret'
  );
});
it('rechecks authorization on every new websocket subscription and returns sanitized denials', async () => {
  const { gateway, client, lists, ability } = context();
  const request = { backup: true, search: { limit: 20 }, requestId: 'request' };
  await gateway.watch(client, request);
  expect(lists.subscribe).toHaveBeenCalledWith(
    client,
    true,
    expect.objectContaining({ limit: 20 }),
    { filesystem: false, mover: true, restores: false },
    'request'
  );
  ability.can.mockReturnValue(false);
  await gateway.watch(client, request);
  expect(lists.subscribe).toHaveBeenCalledTimes(1);
  expect(client.emit).toHaveBeenCalledWith('pod-volumes:error', {
    backup: true,
    requestId: 'request',
    code: 403,
  });
});
it('scopes unsubscribe by menu and clears both subscriptions on disconnect', () => {
  const { gateway, client, lists } = context();
  gateway.unwatch(client, { backup: false });
  expect(lists.unsubscribe).toHaveBeenCalledWith(client, false);
  gateway.unwatch(client, { backup: 'false' });
  expect(lists.unsubscribe).toHaveBeenCalledTimes(1);
  gateway.handleDisconnect(client);
  expect(lists.disconnect).toHaveBeenCalledWith(client);
});
