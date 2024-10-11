import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-microsoft';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private readonly configService: ConfigService) {
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

    return {
      id,
      provider,
      displayName,
      email: emails[0].value
    };
  }
}
