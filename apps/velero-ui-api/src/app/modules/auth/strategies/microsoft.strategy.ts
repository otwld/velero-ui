import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-microsoft';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { AuthenticationException } from '@velero-ui-api/shared/exceptions/authentication.exception';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
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
    profile: any
  ) {
    const { emails, id, provider, displayName } = profile;

    if (!profile) {
      throw new AuthenticationException('Invalid User', {
        cause: MicrosoftStrategy.name,
      });
    }

    const groups: string[] = await lastValueFrom(
      this.getUserGroups(accessToken)
    );

    this.logger.info(
      `Federated Microsoft user ${id} signed in.`,
      MicrosoftStrategy.name
    );

    return {
      id,
      provider,
      displayName,
      email: emails[0].value,
      policy: {
        user: emails[0].value,
        groups,
      },
    };
  }

  private getUserGroups(accessToken: string): Observable<string[]> {
    return this.httpService
      .get('https://graph.microsoft.com/v1.0/me/memberOf', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map((res) =>
          res.data
            ? res.data?.value
                ?.map((group: { displayName: string }) => group.displayName)
                .filter((group) => group)
            : []
        ),
        catchError((err) => {
          this.logger.warn(
            'Error fetching Microsoft Graph groups: ' + err.response?.data ||
              err.message,
            MicrosoftStrategy.name
          );
          return of([]);
        })
      );
  }
}
