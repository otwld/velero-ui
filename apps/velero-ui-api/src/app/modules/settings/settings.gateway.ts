import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SettingsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  afterInit(server: Server) {
    console.log('Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`client connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`client connected ${client.id}`);
  }

  @SubscribeMessage('logs:server')
  logsServer(): string[] {
    return ['id'];
  }

  @SubscribeMessage('logs:node')
  logsNode(@MessageBody('name') name: string): string[] {
    return ['id'];
  }
}
