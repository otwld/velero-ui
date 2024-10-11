import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InternalOAuthError, Strategy } from 'passport-oauth2';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('oauth.clientId') || ' ',
      clientSecret: configService.get('oauth.clientSecret'),
      scope: configService.get('oauth.scopes'),
      callbackURL: configService.get('oauth.redirectUri'),
      authorizationURL: configService.get('oauth.authorizationUrl') || ' ',
      tokenURL: configService.get('oauth.tokenUrl') || ' ',
    });
  }

  public async validate(accessToken: string, refreshToken: string) {
    try {
      const profile = await this.getUserProfile(accessToken);

      const { id, emails, provider, displayName } = profile;
      return {
        id,
        provider,
        displayName,
        email: emails[0].value,
      };
    } catch (e) {
      console.error(e);
    }
  }

  private async getUserProfile(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.configService.get('oauth.userInfoUrl'));
      this._oauth2.get(
        this.configService.get('oauth.userInfoUrl'),
        accessToken,
        function (err, body: string, res) {
          if (err) {
            reject(new InternalOAuthError('Failed to fetch user profile', err));
          }

          try {
            const json = JSON.parse(body);

            const profile = {
              provider: 'oauth',
              id: json.sub,
              displayName: json.name,
              emails: [
                {
                  value: json.email,
                },
              ],
              ...json,
            };

            resolve(profile);
          } catch (ex) {
            reject(new Error('Failed to parse user profile'));
          }
        },
      );
    });
  }
}
