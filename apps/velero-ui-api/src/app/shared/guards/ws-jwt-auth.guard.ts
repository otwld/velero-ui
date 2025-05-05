import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake?.auth?.token;

    if (this.authService.noAuthRequired()) {
      return true;
    }

    if (!token) {
      client._error('Authentication error: No token provided');
      this.logger.error(
        `Client Authentication error ${client.id}: No token provided`,
        WsJwtAuthGuard.name,
      );
      return false;
    }

    try {
      const decoded = jwt.verify(token, this.configService.get('app.secret'), {
        ignoreExpiration: false,
      });
      client.data.user = decoded;
      return true;
    } catch (error) {
      client._error('Authentication error: Invalid token');
      this.logger.error(
        `Client Authentication error ${client.id}: Invalid token`,
        WsJwtAuthGuard.name,
      );
    }
  }
}
