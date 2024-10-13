import { Controller, Get } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import type {
  AppConfig,
  AppPublicConfig,
  BasicAuthConfig,
  LDAPConfig,
} from '@velero-ui/shared-types';
import { ConfigService } from '@nestjs/config';
import { Public } from '@velero-ui-api/shared/decorators/public.decorator';

@Public()
@Controller('config')
export class AppConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
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
      },
      oauth: {
        enabled: this.configService.get('oauth.enabled') || false,
        name: this.configService.get('oauth.name'),
        scopes: this.configService.get('oauth.scopes'),
        clientId: this.configService.get('oauth.clientId'),
        redirectUri: this.configService.get('oauth.redirectUri'),
        authorizationUrl: this.configService.get('oauth.authorizationUrl'),
        tokenUrl: this.configService.get('oauth.tokenUrl'),
      },
    };

    return of(config);
  }
}
