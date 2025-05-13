---
sidebar_position: 1
title: LDAP
---

# LDAP Authentication

Velero UI supports authentication via LDAP (Lightweight Directory Access Protocol). This section explains how to configure and enable LDAP authentication using environment variables.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LDAP_ENABLED` | Set to `true` to enable LDAP authentication. Default is `false`. |
| `LDAP_URL` | The LDAP server URL (e.g., `ldap://localhost:389/`). |
| `LDAP_BIND_DN` | The distinguished name (DN) of the LDAP user used for binding. |
| `LDAP_BIND_CREDENTIALS` | The password or credentials for the LDAP bind user. |
| `LDAP_SEARCH_BASE` | The base DN where user searches will be performed. |
| `LDAP_SEARCH_FILTER` | The filter to locate a user in the directory. Example: `(uid={{username}})`. |
| `LDAP_SEARCH_ATTRIBUTES` | Attributes to retrieve from the LDAP directory (optional). |

## Steps to Configure LDAP Authentication

1. **Set Up an LDAP Server**
   - If you don’t have an LDAP server, you can use OpenLDAP or Microsoft Active Directory.
   - Ensure that the server is running and accessible at the configured `LDAP_URL`.

2. **Define LDAP Search Parameters**
   - Identify the **Bind DN** and **Bind Credentials** to connect to the LDAP server.
   - Determine the **Search Base** and **Search Filter** to locate users in the directory.

3. **Set Environment Variables**
   - Update your environment variables with your LDAP settings.
   - Example:
     ```bash
     LDAP_ENABLED=true
     LDAP_URL=ldap://localhost:389/
     LDAP_BIND_DN=cn=admin,dc=example,dc=org
     LDAP_BIND_CREDENTIALS=admin
     LDAP_SEARCH_BASE=ou=users,dc=example,dc=org
     LDAP_SEARCH_FILTER=(uid={{username}})
     LDAP_SEARCH_ATTRIBUTES=
     LDAP_GROUP_SEARCH_BASE=
     ```

4. **Restart Your Application**
   - Restart the Velero UI to apply the changes.

## RBAC

If you are using LDAP groups for RBAC, ensure that the LDAP server is configured to return group memberships. This allows Velero UI to read the user's group memberships.

You can define the group claim with the `LDAP_GROUP_SEARCH_BASE` environment variable.

**Group syntax is** `group_name`, example: `admin`.

Then refer to the [RBAC documentation](../rbac.md) for further configuration.

## Troubleshooting

- Ensure the LDAP server is running and accessible.
- Verify that `LDAP_ENABLED` is set to `true`.
- Check logs for authentication errors.
- Ensure that the **Bind DN** and **Bind Credentials** are correct.
- Confirm that the **Search Base** and **Search Filter** match your LDAP directory structure.

## Conclusion

Once configured, users will be able to sign in to Velero UI using their LDAP credentials for authentication.


