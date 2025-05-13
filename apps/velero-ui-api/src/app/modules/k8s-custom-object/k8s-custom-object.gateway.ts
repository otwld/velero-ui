import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '@velero-ui-api/shared/guards/ws-jwt-auth.guard';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { AppAbility, CaslAbilityFactory } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Resources } from "@velero-ui/velero";
import { Action } from "@velero-ui/shared-types";

@WebSocketGateway({ cors: true })
export class K8sCustomObjectGateway implements OnGatewayDisconnect {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    this.k8sCustomObjectService.unWatch(client);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage(`watch:on`)
  public watchOn(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
    @MessageBody('plural') plural: string,
    @MessageBody('version') version: string
  ): void {
    const ability: AppAbility = this.caslAbilityFactory.createForUser(client.data.user);

    for (const [key, value] of Object.entries(Resources)) {
      if (ability.can(Action.Read, value.plural)) {
        this.k8sCustomObjectService.watch(client, plural, name, version);
        break;
      }
    }

    throw new WsException('Access denied by policy');
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage(`watch:off`)
  public watchOff(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string
  ): void {
    this.k8sCustomObjectService.unWatch(client, name);
  }
}
