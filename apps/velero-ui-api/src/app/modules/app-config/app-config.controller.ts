import { Controller, Get } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AppPublicConfig } from '@velero-ui/shared-types';
import { ConfigService } from '@nestjs/config';
import { Public } from '@velero-ui-api/shared/decorators/public.decorator';

@Public()
@Controller('config')
export class AppConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  public getAppConfig(): Observable<AppPublicConfig> {
    const appConfig = this.configService.get('app');
    const {
      scopes,
      clientId,
      authority,
      enabled: oidcEnabled,
    } = this.configService.get('oidc');
    const { enabled: basicAuthEnabled } = this.configService.get('basicAuth');
    const { enabled: LDAPAuthEnabled } = this.configService.get('ldap');

    const config = {
      ...appConfig,
      oidc: {
        enabled: oidcEnabled,
        scopes,
        clientId,
        authority,
      },
      basicAuth: {
        enabled: basicAuthEnabled || LDAPAuthEnabled,
      },
    };

    return of(config);
  }
}
