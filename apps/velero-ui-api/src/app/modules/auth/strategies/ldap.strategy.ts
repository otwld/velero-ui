import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { IncomingMessage } from 'http';
import { Action } from "@velero-ui/shared-types";

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService,
  ) {

    super({
      passReqToCallback: true,
      server: {
        url: configService.get('ldap.url'),
        bindDN: configService.get('ldap.bindDn'),
        bindCredentials: configService.get('ldap.bindCredentials'),
        searchBase: configService.get('ldap.searchBase'),
        searchFilter: configService.get('ldap.searchFilter'),
        searchAttributes: configService.get('ldap.searchAttributes'),
      },
      credentialsLookup: (req: IncomingMessage) => {
        return (req as any).body;
      },
    });
  }

  public validate(req, user: any) {
    this.logger.debug(
      `Try to validate LDAP user ${req.body?.username} with password ****...`,
      LdapStrategy.name,
    );

    if (!user) {
      return null;
    }

    this.logger.info(`LDAP user ${user.uid} signed in.`, LdapStrategy.name);

    return {
      id: user.uid,
      provider: 'ldap',
      displayName: user.givenName,
      permissions: [{ action: Action.Manage, subject: 'all' }],
    };
  }
}
