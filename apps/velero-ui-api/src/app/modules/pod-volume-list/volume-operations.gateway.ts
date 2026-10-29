import { ForbiddenException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Socket } from 'socket.io';
import { Action } from '@velero-ui/shared-types';
import { WsJwtAuthGuard } from '../../shared/guards/ws-jwt-auth.guard';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { AuthService } from '../auth/auth.service';
import { VolumeOperationsService } from './volume-operations.service';
import {
  VolumeOperationsUnwatchDto,
  VolumeOperationsWatchDto,
} from './volume-operations.dto';
@WebSocketGateway({ cors: true })
export class VolumeOperationsGateway implements OnGatewayDisconnect {
  constructor(
    private readonly operations: VolumeOperationsService,
    private readonly abilities: CaslAbilityFactory,
    private readonly auth: AuthService
  ) {}
  handleDisconnect(client: Socket) {
    this.operations.disconnect(client);
  }
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('volume-operations:watch')
  async watch(@ConnectedSocket() client: Socket, @MessageBody() body: unknown) {
    const value = plainToInstance(VolumeOperationsWatchDto, body);
    if (!this.valid(value)) {
      this.error(client, body, 400);
      return;
    }
    this.operations.unsubscribe(client, value.requestId);
    try {
      if (
        !this.auth.noAuthRequired() &&
        !this.abilities
          .createForUser(client.data.user)
          .can(Action.Read, value.plural as never)
      )
        throw new ForbiddenException();
      await this.operations.subscribe(client, value);
    } catch (error) {
      this.error(client, body, error?.getStatus?.() === 403 ? 403 : 500);
    }
  }
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('volume-operations:unwatch')
  unwatch(@ConnectedSocket() client: Socket, @MessageBody() body: unknown) {
    const value = plainToInstance(VolumeOperationsUnwatchDto, body);
    if (!this.valid(value)) {
      this.error(client, body, 400);
      return;
    }
    this.operations.unsubscribe(client, value.requestId);
  }
  private valid(value: object) {
    return (
      value &&
      typeof value === 'object' &&
      !validateSync(value, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }).length
    );
  }
  private error(client: Socket, body: unknown, code: number) {
    const requestId = (body as { requestId?: unknown })?.requestId;
    client.emit('volume-operations:event', {
      requestId: typeof requestId === 'string' ? requestId.slice(0, 128) : '',
      phase: 'ERROR',
      code,
    });
  }
}
