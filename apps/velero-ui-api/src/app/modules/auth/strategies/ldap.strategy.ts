import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { IncomingMessage } from 'http';
import { Action } from '@velero-ui/shared-types';
import { Client } from 'ldapts';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(
    private logger: AppLogger,
    private readonly configService: ConfigService
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

  public async validate(req, user: any) {
    this.logger.debug(
      `Try to validate LDAP user ${req.body?.username} with password ****...`,
      LdapStrategy.name
    );

    if (!user) {
      return null;
    }

    let groups: string[] = [];

    if (this.configService.get('ldap.groupSearchBase')) {
      groups = await this.getUserGroups(user);
    }

    this.logger.info(`LDAP user ${user.uid} signed in.`, LdapStrategy.name);

    return {
      id: user.uid,
      provider: 'ldap',
      displayName: user.givenName,
      permissions: {
        user: user.username,
        groups
      },
    };
  }

  private async getUserGroups(user: any): Promise<string[]> {
    const ldapUrl = this.configService.get('ldap.url');
    const client = new Client({ url: ldapUrl });

    try {
      await client.bind(
        this.configService.get('ldap.bindDn'),
        this.configService.get('ldap.bindCredentials')
      );

      const groupSearchBase = this.configService.get('ldap.groupSearchBase');
      const userDn = `uid=${user.uid},${this.configService.get('ldap.searchBase')}`;

      const { searchEntries } = await client.search(groupSearchBase, {
        scope: 'sub',
        filter: `(member=${userDn})`,
        attributes: ['cn'],
      });

      return searchEntries.map((entry) => entry.cn as string);
    } catch (error) {
      this.logger.warn(
        'Error fetching LDAP groups: ' + error.message,
        LdapStrategy.name
      );
      return [];
    }
  }
}
