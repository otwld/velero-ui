---
sidebar_position: 5
slug: /certificate
title: 🔏 Certificate
hide_title: true
---

# 🔏 **Trust a Corporate Certificate Authority**

When Velero UI connects to an internal or private service over HTTPS using a **corporate or self-signed certificate**, you may encounter TLS errors because Node.js does **not trust non-public certificate authorities by default**.

---

## ❗ Problem

Velero uses Node.js environment, therefore applications making HTTPS requests to internal services with custom certificates may fail with errors like:

```
InternalOAuthError: Failed to obtain access token
Error: TLS handshake error
```

or in you service logs:

```
TLS handshake error ... EOF
```

## ✅ Solution: NODE_EXTRA_CA_CERTS

Node.js (and Velero UI) supports extending its list of trusted certificate authorities via the environment variable `NODE_EXTRA_CA_CERTS`.

To trust a corporate certificate:

1. Bundle all required certificates into a single PEM file.
2. Mount this file inside the Velero UI container.
3. Set `NODE_EXTRA_CA_CERTS` to point to this file.

## 🛠️ Step-by-Step Setup

### 1. 🔧 Create a Bundle File

If you have multiple .crt files (e.g. root CA and intermediate CA), combine them into one file:

```bash
cat corp-root.crt corp-intermediate.crt > corp-bundle.crt
```

### 2. 📦 Mount the Certificate File

In a Docker or Kubernetes setup, mount the file into Velero UI container.

```yaml
volumeMounts:
  - name: corp-ca
    mountPath: /etc/ssl/certs
    readOnly: true

volumes:
  - name: corp-ca
    configMap:
      name: corporate-ca
```

Or using a `Secret, depending on your security practices.

## 3. 🌍 Set NODE_EXTRA_CA_CERTS

Configure Velero UI to use the certificate bundle:

Docker (Dockerfile or Compose):
```bash
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/corp-bundle.crt
```

Kubernetes or Helm:

```yaml
env:
  - name: NODE_EXTRA_CA_CERTS
    value: /etc/ssl/certs/corp-bundle.crt
```
:::warning This path must point to a single file, not a directory.
:::

## 4. 🚀 Restart Velero UI

After setting the environment variable and mounting the certificate file, restart Velero UI to apply the changes.
