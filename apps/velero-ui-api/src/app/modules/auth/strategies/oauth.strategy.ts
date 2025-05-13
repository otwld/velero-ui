import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InternalOAuthError, Strategy } from 'passport-oauth2';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import {AuthenticationException} from "@velero-ui-api/shared/exceptions/authentication.exception";

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('oauth.clientId') || ' ',
      clientSecret: configService.get('oauth.clientSecret'),
      scope: configService.get('oauth.scopes'),
      callbackURL: configService.get('oauth.redirectUri'),
      authorizationURL: configService.get('oauth.authorizationUrl') || ' ',
      tokenURL: configService.get('oauth.tokenUrl') || ' ',
    });
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  public async validate(accessToken: string) {
    try {
      const profile = await this.getUserProfile(accessToken);

      const { id, emails, provider, displayName } = profile;

      this.logger.info(
        `Federated OAuth2 user ${id} signed in.`,
        OauthStrategy.name,
      );

      return {
        id,
        provider,
        displayName,
        email: emails[0].value,
      };
    } catch (e) {
      this.logger.error(e, OauthStrategy.name);
      throw new AuthenticationException('Invalid User', {
        cause: OauthStrategy.name,
      });
    }
  }

  private async getUserProfile(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._oauth2.get(
        this.configService.get('oauth.userInfoUrl'),
        accessToken,
        function (err, body: string) {
          if (err) {
            reject(new InternalOAuthError('Failed to fetch user profile', err));
            return;
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
