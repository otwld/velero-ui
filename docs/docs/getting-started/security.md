---
sidebar_position: 5
title: Security configuration
---

The API requires a random `AUTH_SECRET_PASSPHRASE` of at least 32 bytes. Generate one with `openssl rand -hex 32`. The previous public signing keys and `admin/admin` credentials are no longer accepted. Rotate any previously used default key; existing sessions will need to sign in again.

For Docker or local development, copy `.env.example` to `.env`, set the signing key, and set `BASIC_AUTH_USERNAME` and a strong `BASIC_AUTH_PASSWORD`. Keep this file private (`chmod 600 .env`). For SSO only, set `BASIC_AUTH_ENABLED=false`, enable your provider and configure `POLICY_FILE_PATH`.

Federated users require explicit RBAC permissions. Missing or empty policies grant no permissions. An unreadable configured file or invalid rule prevents startup. The local account retains administrator privileges.

For Kubernetes, create the namespace first, then create a Secret named `velero-ui-auth` with these keys:

```text
pass_phrase=<random JWT signing key>
username=<local administrator username>
password=<strong unique password>
```

Save these entries in a private file outside the repository and run:

```bash
kubectl create secret generic velero-ui-auth --namespace velero-ui --from-env-file=/private/path/auth.env
```

The plain manifests reference this Secret. For Helm, use the following `values-local.yaml`:

```yaml
configuration:
  general:
    secretPassPhrase:
      existingSecret: velero-ui-auth
env:
  - name: BASIC_AUTH_USERNAME
    valueFrom:
      secretKeyRef:
        name: velero-ui-auth
        key: username
  - name: BASIC_AUTH_PASSWORD
    valueFrom:
      secretKeyRef:
        name: velero-ui-auth
        key: password
```

Alternatively, Helm can create the signing Secret from `configuration.general.secretPassPhrase.value`. Its default is empty and must be configured. With `useSecret: false`, the configured value is injected directly; prefer a Secret in production. Do not also set `AUTH_SECRET_PASSPHRASE` through `env`.

For SSO, replace the two local credential entries with `BASIC_AUTH_ENABLED=false` and your provider configuration. Enable `configuration.policies.enabled` and supply explicit rules in `configuration.policies.value` or an existing ConfigMap.

On upgrade, restart the pods after rotating the signing Secret. Backup, schedule and restore requests now reject unknown fields, including execution hooks. Configure privileged hooks through your trusted Kubernetes administration workflow instead of this API.
