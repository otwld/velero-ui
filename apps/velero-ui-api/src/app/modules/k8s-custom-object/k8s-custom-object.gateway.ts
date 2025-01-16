import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '@velero-ui-api/shared/guards/ws-jwt-auth.guard';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';


@WebSocketGateway({ cors: true })
export class K8sCustomObjectGateway implements OnGatewayDisconnect {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService,
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
    @MessageBody('version') version: string,
  ): void {
    this.k8sCustomObjectService.watch(client, plural, name, version);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage(`watch:off`)
  public watchOff(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ): void {
    this.k8sCustomObjectService.unWatch(client, name);
  }
}
