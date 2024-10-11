import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
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

    return {
      id,
      provider,
      displayName,
      email: emails[0].value,
      picture: photos[0].value,
    };
  }
}
