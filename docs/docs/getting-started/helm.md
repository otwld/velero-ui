---
sidebar_position: 1
title: ☸️ Start with Helm Chart
---

## 🚀 Getting Started with Helm Chart

:::tip 🔑 **Credentials**

There are no default credentials. Configure a random JWT signing key and explicit local credentials before starting. See [Security configuration](./security.md).

For SSO-only deployments, explicitly set `BASIC_AUTH_ENABLED=false` and configure RBAC policies.

:::

### 📦 Installing from Registry

1. Add OTWLD repository
    ```bash
    helm repo add otwld https://helm.otwld.com/
    ```

2. Update repository
    ```bash
    helm repo update
    ```

3. Create a `values-local.yaml` file following [Security configuration](./security.md). A signing secret and authentication settings are required.

   :::tip Environment Variables
   You can add [environment variables](/getting-started/environment-variables) in the values.yaml
      ```yaml
      env: []
      envFrom: []
      ``` 
   :::

4. Create a namespace
    ```bash
    kubectl create namespace velero-ui
    ```

5. Install the chart
    ```console
    helm install velero-ui otwld/velero-ui --namespace velero-ui --values values-local.yaml
    ```

### 🖥️ Installing from Source

1. Clone the repository
  - Using SSH
      ```bash
      git clone git@github.com:otwld/velero-ui.git
      ```
  - Using HTTPS
     ```bash
      git clone https://github.com/otwld/velero-ui.git
      ```

2. Go to the chart directory
    ```bash
    cd velero-ui/kubernetes/chart
    ```
3. Create a `values-local.yaml` file following [Security configuration](./security.md). A signing secret and authentication settings are required.

   :::tip Environment Variables
   You can add [environment variables](/getting-started/environment-variables) in the values.yaml
      ```yaml
      env: []
      envFrom: []
      ``` 
   :::
4. Create a namespace
    ```bash
    kubectl create namespace velero-ui
    ```
5. Install the chart
    ```console
    helm install velero-ui . --namespace velero-ui --values values-local.yaml
    ```

### 🔄 Upgrading

Make adjustments to your values as needed, then run `helm upgrade`:

1. Update repository
    ```bash
    helm repo update
    ```

2. Upgrade
    ```bash
   helm upgrade velero-ui olwld/velero-ui --namespace velero-ui --values values.yaml

### 🗑 Uninstalling

To uninstall/delete the velero-ui deployment in the velero-ui namespace:

```bash
helm delete velero-ui --namespace velero-ui
```

See `helm delete --help for a full reference on delete parameters and flags.
