import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { LdapStrategy } from './ldap.strategy';

describe('LdapStrategy', () => {
  it('returns the LDAP user identity for policy lookup', async () => {
    const config = new ConfigService({
      ldap: {
        url: 'ldap://localhost',
        searchBase: 'dc=example,dc=com',
        searchFilter: '(uid={{username}})',
      },
    });
    const logger = {
      debug: jest.fn(),
      info: jest.fn(),
    } as unknown as AppLogger;
    const strategy = new LdapStrategy(logger, config);

    await expect(
      strategy.validate(
        { body: { username: 'p11' } },
        { uid: 'p11', givenName: 'P11' }
      )
    ).resolves.toEqual({
      id: 'p11',
      provider: 'ldap',
      displayName: 'P11',
      policy: {
        user: 'p11',
        groups: [],
      },
    });
  });
});
