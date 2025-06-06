import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import type {
  AppConfig,
  AppPublicConfig,
  BasicAuthConfig,
  LDAPConfig,
} from '@velero-ui/shared-types';
import { ConfigService } from '@nestjs/config';
import { Public } from '@velero-ui-api/shared/decorators/public.decorator';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";

@Public()
@Controller('config')
export class AppConfigController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(0)
  public getAppConfig(): Observable<Partial<AppPublicConfig>> {
    const { grafanaUrl, baseUrl } = this.configService.get('app') as AppConfig;
    const { enabled: basicAuthEnabled } = this.configService.get(
      'basicAuth',
    ) as BasicAuthConfig;
    const { enabled: LDAPAuthEnabled } = this.configService.get(
      'ldap',
    ) as LDAPConfig;

    const config = {
      baseUrl,
      grafanaUrl,
      noAuthRequired: this.authService.noAuthRequired(),
      basicAuth: {
        enabled: basicAuthEnabled || LDAPAuthEnabled,
      },
      google: {
        enabled: this.configService.get('google.enabled') || false,
        scopes: this.configService.get('google.scopes'),
        clientId: this.configService.get('google.clientId'),
        redirectUri: this.configService.get('google.redirectUri'),
      },
      github: {
        enabled: this.configService.get('github.enabled') || false,
        scopes: this.configService.get('github.scopes'),
        clientId: this.configService.get('github.clientId'),
        redirectUri: this.configService.get('github.redirectUri'),
      },
      gitlab: {
        enabled: this.configService.get('gitlab.enabled') || false,
        scopes: this.configService.get('gitlab.scopes'),
        clientId: this.configService.get('gitlab.clientId'),
        redirectUri: this.configService.get('gitlab.redirectUri'),
        baseUrl: this.configService.get('gitlab.baseUrl'),
      },
      microsoft: {
        enabled: this.configService.get('microsoft.enabled') || false,
        scopes: this.configService.get('microsoft.scopes'),
        clientId: this.configService.get('microsoft.clientId'),
        redirectUri: this.configService.get('microsoft.redirectUri'),
        tenant: this.configService.get('microsoft.tenant'),
        authorizationUrl: this.configService.get('microsoft.authorizationUrl'),
      },
      oauth: {
        enabled: this.configService.get('oauth.enabled') || false,
        name: this.configService.get('oauth.name'),
        scopes: this.configService.get('oauth.scopes'),
        clientId: this.configService.get('oauth.clientId'),
        redirectUri: this.configService.get('oauth.redirectUri'),
        authorizationUrl: this.configService.get('oauth.authorizationUrl'),
      },
    };

    return of(config);
  }
}
