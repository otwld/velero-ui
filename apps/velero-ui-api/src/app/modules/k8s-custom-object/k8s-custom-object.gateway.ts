import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '@velero-ui-api/shared/guards/ws-jwt-auth.guard';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  AppAbility,
  CaslAbilityFactory,
} from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { PluralsNames } from '@velero-ui/velero';
import { Action } from '@velero-ui/shared-types';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ cors: true })
export class K8sCustomObjectGateway implements OnGatewayDisconnect {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly authService: AuthService
  ) {}

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    this.k8sCustomObjectService.unWatchAll(client);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage(`watch:on`)
  public watchOn(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
    @MessageBody('plural') plural: string,
    @MessageBody('version') version: string
  ): void {
    if (!this.authService.noAuthRequired()) {
      const ability: AppAbility = this.caslAbilityFactory.createForUser(
        client.data.user
      );
      // Authorize every requested source separately when authentication is enabled.
      if (!ability.can(Action.Read, plural as PluralsNames)) {
        throw new WsException('Access denied by policy');
      }
    }

    this.k8sCustomObjectService.watch(client, plural, name, version);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage(`watch:off`)
  public watchOff(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
    @MessageBody('plural') plural?: string
  ): void {
    this.k8sCustomObjectService.unWatch(client, name, plural);
  }
}
