import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SettingsService } from '@velero-ui-api/modules/settings/settings.service';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '@velero-ui-api/shared/guards/ws-jwt-auth.guard';
import {
  AppAbility,
  CaslAbilityFactory,
} from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Action, LogType } from '@velero-ui/shared-types';

@WebSocketGateway({ cors: true })
export class SettingsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly settingsService: SettingsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private logger: AppLogger
  ) {}

  handleConnection(@ConnectedSocket() client: Socket): void {
    this.logger.debug(`Client connected ${client.id}`, WebSocketGateway.name);
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    this.logger.debug(
      `Client disconnected ${client.id}`,
      WebSocketGateway.name
    );
    this.settingsService.closeLogsSteam(client);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('settings:logs:on')
  public logsServerOn(
    @ConnectedSocket() client: Socket,
    @MessageBody('type') type: LogType,
    @MessageBody('name') name: string
  ): void {
    const ability: AppAbility = this.caslAbilityFactory.createForUser(
      client.data.user
    );

    if (ability.can(Action.Manage, 'all')) {
      this.settingsService.openLogsStream(client, type, name);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('settings:logs:off')
  public logsServerOff(@ConnectedSocket() client: Socket): void {
    this.settingsService.closeLogsSteam(client);
  }
}
