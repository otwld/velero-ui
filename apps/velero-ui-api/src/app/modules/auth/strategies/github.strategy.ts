import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-github2';
import { AuthenticationException } from '@velero-ui-api/shared/exceptions/authentication.exception';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
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
    profile: any
  ) {
    const { emails, photos, id, provider, displayName, username } = profile;

    if (!profile) {
      throw new AuthenticationException('Invalid User', {
        cause: GithubStrategy.name,
      });
    }

    const groups: string[] = [];
    if (
      this.configService
        .get<string>('github.scopes')
        .includes('read:org')
    ) {
      const orgs: string[] = await lastValueFrom(
        this.getUserOrganizations(accessToken)
      );
      groups.push(...orgs);

      for (const org of orgs) {
        const role: string = await lastValueFrom(
          this.getUserMembership(org, username, accessToken)
        );

        if (role) {
          groups.push(`${ org }:${ role }`);
        }
      }
    }

    this.logger.info(
      `Federated Github user ${id} signed in.`,
      GithubStrategy.name
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

  private getUserOrganizations(accessToken: string): Observable<string[]> {
    return this.httpService
      .get('https://api.github.com/user/orgs', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .pipe(
        map((res) =>
          res.data ? res.data?.map((org: { login: string }) => org.login) : []
        ),
        catchError((err) => {
          this.logger.warn('Failed to fetch GitHub organizations', err.message);
          return of([]);
        })
      );
  }

  private getUserMembership(
    org: string,
    username: string,
    accessToken: string
  ): Observable<string> {
    return this.httpService
      .get(`https://api.github.com/orgs/${org}/memberships/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .pipe(
        map((res) => res.data?.role),
        catchError((err) => {
          this.logger.warn(
            'Failed to fetch GitHub user membership: ' + err.message,
            GithubStrategy.name
          );
          return of(null);
        })
      );
  }
}
