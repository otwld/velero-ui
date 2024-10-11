import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
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
