---
sidebar_position: 1
title: 🔒 Role Based Access Control (RBAC)
---

# Role Based Access Control (RBAC)

Velero UI supports Role Based Access Control (RBAC) to manage user permissions and access levels. This guide explains how to configure RBAC in Velero UI.

## Overview

RBAC allows you to define roles and assign them to users or groups. Each role contains a set of permissions that determine what actions users can perform within the Velero UI.

RBAC requires at least one Federated authentication to be enabled. Either LDAP or OAuth2 authentication can be used. RBAC refers to **groups and users** defined in the provider. For more information on configuring Federated authentication, refer to the [Federated Authentication](/category/-providers) documentation.

## File Structure

RBAC policies are defined in a CSV file. An `policies.csv` file example is provided at root repository.

Depending on the deployment method, the file can be mounted as a volume or copied to the container.

Velero UI uses the environment variable `POLICY_FILE_PATH` to load the RBAC policies. The default value is `./policies.csv`.

## Model Structure

There are two different types of syntax: one for assigning actions to groups and another one for assigning actions to users.

**Group:** Allows to assign authenticated groups to internal actions.

Syntax: `g,<group>,<action>,<subject>`

- `<group>` is the **name of the group** in the provider.
- `<action>` is the action to be performed.
- `<subject>` is the subject of the action.

**To match all groups, use `*` as group.**

**User:** Allows to assign authenticated user to internal actions.

Syntax: `g,<user>,<action>,<subject>`

- `<user>` is the **email of the user or username for LDAP** in the provider.
- `<action>` is the action to be performed.
- `<subject>` is the subject of the action.

**To match all users, use `*` as email.**

Below is a table that summarizes all possible resources and which actions are valid for each of them.

| Subject \ Action        | manage (All actions) | read | create | update | delete | download | logs |
|-------------------------|----------------------|------|--------|--------|--------|----------|------|
| backups                 | ✅                    | ✅    | ✅      | ❌      | ✅      | ✅        | ✅    |
| schedules               | ✅                    | ✅    | ✅      | ✅      | ✅      | ❌        | ❌    |
| restores                | ✅                    | ✅    | ✅      | ❌      | ✅      | ✅        | ✅    |
| backupstoragelocations  | ✅                    | ✅    | ✅      | ✅      | ✅      | ❌        | ❌    |
| volumesnapshotlocations | ✅                    | ✅    | ✅      | ✅      | ✅      | ❌        | ❌    |
| podvolumebackups        | ✅                    | ✅    | ❌      | ❌      | ✅      | ❌        | ❌    |
| podvolumerestores       | ✅                    | ✅    | ❌      | ❌      | ✅      | ❌        | ❌    |
| downloadrequests        | ✅                    | ✅    | ❌      | ❌      | ✅      | ❌        | ❌    |
| deletebackuprequests    | ✅                    | ✅    | ❌      | ❌      | ✅      | ❌        | ❌    |
| serverstatusrequests    | ✅                    | ✅    | ❌      | ❌      | ❌      | ❌        | ❌    |
| settings                | ✅                    | ❌    | ❌      | ❌      | ❌      | ❌        | ❌    |
| all (All subjects)      | ✅                    | ✅    | ✅      | ✅      | ✅      | ✅        | ✅    |

## Default behavior for users

- Internal user is assigned to all actions as `u,admin,manage,all`.
- If no group or user is defined to a specific action, the default behavior is to allow access to all actions and resources as `u,*,manage,all`.

## Combined syntax

You can combine the group and user policies in the same file. The order of the policies does not matter, as they are evaluated independently.

#### Example

```csv
g,*,read,all
g,developers,create,backups
u,example@org.com,manage,backups
u,example@org.com,read,schedules
```

In this example, all users can read all resources, the group `developers` can create backups, and the user `example@org.com` can manage backups and read schedules.

## Retrieving groups from providers

RBAC can be combined with multiple providers. The groups are retrieved from the provider and used to match the policies.

Refers to each provider to configure RBAC:

- [Generic Oauth2](./providers/generic.md#rbac)
- [Github](./providers/github.md#rbac)
- [Gitlab](./providers/gitlab.md#rbac)
- [Google](./providers/google.md#rbac)
- [LDAP](./providers/ldap.md#rbac)
- [Microsoft](./providers/microsoft.md#rbac)
