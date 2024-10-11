import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-gitlab2';

@Injectable()
export class GitlabStrategy extends PassportStrategy(Strategy, 'gitlab') {
  constructor(private readonly configService: ConfigService) {
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

    console.log(profile)

    const { emails, avatarUrl, id, provider, displayName } = profile;

    return {
      id,
      provider,
      displayName,
      email: emails[0].value,
      picture: avatarUrl,
    };
  }
}
