import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { AuthenticationException } from '@velero-ui-api/shared/exceptions/authentication.exception';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
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
    profile: any
  ) {
    const { emails, photos, id, provider, displayName } = profile;

    if (!profile) {
      throw new AuthenticationException('Invalid User', {
        cause: GoogleStrategy.name,
      });
    }

    let groups: string[] = [];

    if (
      this.configService
        .get<string>('google.scopes')
        .includes('cloud-identity.groups.readonly')
    ) {
      groups = await lastValueFrom(this.getUserGroups(accessToken));
    }

    this.logger.info(
      `Federated Google user ${id} signed in.`,
      GoogleStrategy.name
    );

    return {
      id,
      provider,
      displayName,
      email: emails[0].value,
      picture: photos[0].value,
      policy: {
        user: emails[0].value,
        groups,
      },
    };
  }

  private getUserGroups(accessToken: string): Observable<string[]> {
    return this.httpService
      .get('https://cloudidentity.googleapis.com/v1/groups', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(
        map((res) =>
          res.data
            ? res.data?.groups
                ?.map((group: { name: string }) => group.name)
                .filter((group) => group)
            : []
        ),
        catchError((err) => {
          this.logger.warn(
            'Error fetching Google Cloud Identity groups: ' + err.message,
            GoogleStrategy.name
          );
          return of([]);
        })
      );
  }
}
