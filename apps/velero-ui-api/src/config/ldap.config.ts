import { registerAs } from '@nestjs/config';
import process from 'process';
import { LDAPConfig } from '@velero-ui/shared-types';

export default registerAs('ldap', (): LDAPConfig => {
  return {
    enabled: process.env.LDAP_ENABLED === 'true' || false,
    url: process.env.LDAP_URL || '',
    bindDn: process.env.LDAP_BIND_DN || '',
    bindCredentials: process.env.LDAP_BIND_CREDENTIALS || '',
    searchBase: process.env.LDAP_SEARCH_BASE || '',
    searchFilter: process.env.LDAP_SEARCH_FILTER || '',
    searchAttributes: process.env.LDAP_SEARCH_ATTRIBUTES || '',
  };
});
