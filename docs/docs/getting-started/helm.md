---
sidebar_position: 1
title: ☸️ Start with Helm Chart
---

## 🚀 Getting Started with Helm Chart

:::tip 🔑 **Credentials**

The default credentials to sign in are:

- **Username:** admin
- **Password:** admin

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

3. (Optional) Create a configuration file to override or extend default values.yaml
   :::info Optional
   You can use the default values.yaml provided in the chart.
   :::

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
    helm install velero-ui otwld/velero-ui --namespace velero-ui
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
3. (Optional) Create a configuration file to override or extend default values.yaml
   :::info Optional
   You can use the default values.yaml provided in the chart.
   :::

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
    helm install velero-ui . --namespace velero-ui
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
