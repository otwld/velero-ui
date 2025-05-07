import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-microsoft';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { AuthenticationException } from '@velero-ui-api/shared/exceptions/authentication.exception';
import { Action } from "@velero-ui/shared-types";

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('microsoft.clientId') || ' ',
      clientSecret: configService.get('microsoft.clientSecret'),
      scope: configService.get('microsoft.scopes'),
      callbackURL: configService.get('microsoft.redirectUri'),
      tenant: configService.get('microsoft.tenant'),
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const { emails, id, provider, displayName } = profile;

    if (!profile) {
      throw new AuthenticationException('Invalid User', {
        cause: MicrosoftStrategy.name,
      });
    }

    this.logger.info(
      `Federated Microsoft user ${id} signed in.`,
      MicrosoftStrategy.name,
    );

    return {
      id,
      provider,
      displayName,
      email: emails[0].value,
      permissions: [{ action: Action.Manage, subject: 'all' }],
    };
  }
}
