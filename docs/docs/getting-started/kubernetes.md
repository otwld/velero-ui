---
sidebar_position: 2
title: ⚙️ Start with Kubernetes
---
## 🚀 **Getting Started with Kubernetes 🌐**

:::tip 🔑 **Credentials**

The default credentials to sign in are:

- **Username:** admin
- **Password:** admin

:::

### 🛠️ Installation

All Kubernetes manifests are located in [kubernetes/manifests](https://github.com/otwld/velero-ui/blob/main/kubernetes/manifests/), with the default namespace being `velero-ui`.

1. Clone the repository
     - Using SSH
         ```bash
         git clone git@github.com:otwld/velero-ui.git
         ```
     - Using HTTPS
        ```bash
         git clone https://github.com/otwld/velero-ui.git
         ```
       
2. Go to the manifest directory
    ```bash
    cd velero-ui/kubernetes/manifests
    ```

3. Edit manifests
    :::tip
    [Environment variables](/getting-started/environment-variables) can be defined in [kubernetes/manifests/deployment.yml](https://github.com/otwld/velero-ui/blob/main/kubernetes/manifests/deployment.yml)
    :::

4. Apply manifests with kubectl
    ```bash
    kubectl apply -f .
    ```

5. Access via kube-proxy
    ```bash
    kubectl port-forward service/velero-ui 3333:80 -n velero-ui
    ```

6. 🎉 Velero UI is now reachable at `http://localhost:3333`
