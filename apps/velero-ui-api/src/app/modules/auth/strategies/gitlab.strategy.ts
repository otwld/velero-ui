import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-gitlab2';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import {AuthenticationException} from "@velero-ui-api/shared/exceptions/authentication.exception";
import { Action } from "@velero-ui/shared-types";

@Injectable()
export class GitlabStrategy extends PassportStrategy(Strategy, 'gitlab') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('gitlab.clientId') || ' ',
      clientSecret: configService.get('gitlab.clientSecret'),
      scope: configService.get('gitlab.scopes'),
      callbackURL: configService.get('gitlab.redirectUri'),
      baseURL: configService.get('gitlab.baseUrl'),
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const { emails, avatarUrl, id, provider, displayName } = profile;

    if (!profile) {
      throw new AuthenticationException('Invalid User', {
        cause: GitlabStrategy.name,
      });
    }

    this.logger.info(
      `Federated Gitlab user ${id} signed in.`,
      GitlabStrategy.name,
    );

    return {
      id,
      provider,
      displayName,
      email: emails[0].value,
      picture: avatarUrl,
      permissions: [{ action: Action.Manage, subject: 'all' }],
    };
  }
}
