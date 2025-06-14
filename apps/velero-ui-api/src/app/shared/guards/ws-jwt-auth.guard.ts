import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '@velero-ui-api/shared/decorators/check-policies.decorator';
import {
  AppAbility,
  CaslAbilityFactory,
} from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { PluralsNames } from '@velero-ui/velero';
import { SUBJECT_KEY } from '@velero-ui-api/shared/decorators/subject.decorator';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { data } from "autoprefixer";

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly caslAbilityFactory: CaslAbilityFactory
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
        WsJwtAuthGuard.name
      );
      return false;
    }

    try {
      const decoded = jwt.verify(token, this.configService.get('app.secret'), {
        ignoreExpiration: false,
      });
      client.data.user = decoded;

      const ability: AppAbility = this.caslAbilityFactory.createForUser(
        client.data.user
      );

      const subject: PluralsNames =
        this.reflector.getAllAndOverride<PluralsNames>(SUBJECT_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

      const policyHandlers: PolicyHandler[] =
        this.reflector.get<PolicyHandler[]>(
          CHECK_POLICIES_KEY,
          context.getHandler()
        ) || [];

      const allAllowed: boolean = policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability, subject)
      );

      if (!allAllowed) {
        throw new WsException('Access denied by policy');
      }

      return true;
    } catch (error) {
      client._error(`Authentication error: ${error.message}`);
      this.logger.error(
        `Client Authentication error ${client.id}: ${error.message}`,
        WsJwtAuthGuard.name
      );
    }
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    subject?: PluralsNames
  ) {
    if (typeof handler === 'function') {
      if (handler.length === 2) {
        return handler(ability, subject);
      }
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
