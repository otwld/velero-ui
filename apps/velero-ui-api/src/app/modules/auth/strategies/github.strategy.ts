import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-github2';
import { AuthenticationException } from '@velero-ui-api/shared/exceptions/authentication.exception';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { Action } from '@velero-ui/shared-types';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get('github.clientId') || ' ',
      clientSecret: configService.get('github.clientSecret'),
      scope: configService.get('github.scopes'),
      callbackURL: configService.get('github.redirectUri'),
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any
  ) {
    const { emails, photos, id, provider, displayName } = profile;

    if (!profile) {
      throw new AuthenticationException('Invalid User', {
        cause: GithubStrategy.name,
      });
    }

    this.logger.info(
      `Federated Github user ${id} signed in.`,
      GithubStrategy.name
    );

    return {
      id,
      provider,
      displayName,
      email: emails[0].value,
      picture: photos[0].value,
      permissions: [{ action: Action.Manage, subject: 'all' }],
    };
  }
}
