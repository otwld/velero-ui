import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import {AuthenticationException} from "@velero-ui-api/shared/exceptions/authentication.exception";
import { Action } from "@velero-ui/shared-types";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('google.clientId') || ' ',
      clientSecret: configService.get('google.clientSecret'),
      scope: configService.get('google.scopes'),
      callbackURL: configService.get('google.redirectUri'),
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const { emails, photos, id, provider, displayName } = profile;

    if (!profile) {
      throw new AuthenticationException('Invalid User', {
        cause: GoogleStrategy.name,
      });
    }

    this.logger.info(
      `Federated Google user ${id} signed in.`,
      GoogleStrategy.name,
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
