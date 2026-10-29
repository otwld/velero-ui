import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { WsJwtAuthGuard } from '../../shared/guards/ws-jwt-auth.guard';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { AuthService } from '../auth/auth.service';
import { PodVolumeListService } from './pod-volume-list.service';
import { PodVolumeUnwatchDto, PodVolumeWatchDto } from './pod-volume-list.dto';
import { podVolumePermissions } from './pod-volume-list.permissions';

@WebSocketGateway({ cors: true })
export class PodVolumeListGateway implements OnGatewayDisconnect {
  constructor(
    private readonly lists: PodVolumeListService,
    private readonly abilities: CaslAbilityFactory,
    private readonly auth: AuthService
  ) {}
  handleDisconnect(client: Socket) {
    this.lists.disconnect(client);
  }
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('pod-volumes:watch')
  async watch(@ConnectedSocket() client: Socket, @MessageBody() body: unknown) {
    const candidate = body as Partial<PodVolumeWatchDto>;
    if (typeof candidate?.backup === 'boolean')
      this.lists.unsubscribe(client, candidate.backup);
    const value = plainToInstance(PodVolumeWatchDto, body);
    if (
      !value ||
      typeof value !== 'object' ||
      validateSync(value, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }).length
    ) {
      this.error(client, body, 400);
      return;
    }
    try {
      const noAuth = this.auth.noAuthRequired();
      const permissions = podVolumePermissions(
        value.backup,
        noAuth ? undefined : this.abilities.createForUser(client.data.user),
        noAuth
      );
      await this.lists.subscribe(
        client,
        value.backup,
        value.search,
        permissions,
        value.requestId
      );
    } catch (error) {
      this.error(client, body, error?.getStatus?.() === 403 ? 403 : 500);
    }
  }
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('pod-volumes:unwatch')
  unwatch(@ConnectedSocket() client: Socket, @MessageBody() body: unknown) {
    const value = plainToInstance(PodVolumeUnwatchDto, body);
    if (
      !value ||
      typeof value !== 'object' ||
      validateSync(value, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }).length
    ) {
      this.error(client, body, 400);
      return;
    }
    this.lists.unsubscribe(client, value.backup);
  }
  private error(client: Socket, body: unknown, code: number) {
    const value = body as Partial<PodVolumeWatchDto>;
    client.emit('pod-volumes:error', {
      backup: value?.backup === true,
      requestId:
        typeof value?.requestId === 'string'
          ? value.requestId.slice(0, 128)
          : '',
      code,
    });
  }
}
