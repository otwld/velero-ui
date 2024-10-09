---
sidebar_position: 0
title: 🐳 Start with Docker
---
## 🚀 **Getting Started with Docker**

:::tip 🔑 **Credentials**

The default credentials to sign in are:

- **Username:** admin
- **Password:** admin

:::

<details>
<summary>🔧 **Before You Begin**</summary>

### 🛠 **Installing Docker**

#### 🖥️ For Windows and Mac Users:

- Download **Docker Desktop** from [Docker's official website](https://www.docker.com/products/docker-desktop).
- Follow the installation instructions provided. After installation, open **Docker Desktop** to ensure it's running properly.

#### 🐧 For Linux Users (Ubuntu, Debian, CentOS, etc.):

- Download **Docker** from [Docker's official website](https://docs.docker.com/engine/install/).
- Follow the installation instructions provided.

</details>

### ⚙️ **Installation**

1. Locate the path of your Kube Config. The default location is in `~/.kube/config`.

2. Run this Docker command with your Kube config path. You can also specify the context using the [environment variables](/getting-started/environment-variables) `KUBE_CONTEXT`:
    ```bash
    docker run --name velero-ui -v ~/.kube/config:/app/.kube/config -e KUBE_CONFIG_PATH=/app/.kube/config -d -p 3333:3000 otwld/velero-ui:latest
    ```
    Where:
      - **~/.kube/config:/app/.kube/config** links the Kube Config as a volume from the host to the container.
      - **KUBE_CONFIG_PATH=/app/.kube/config** is the path in the container to the Kube Config.

### 📦 **Installation with Docker Compose**

:::info 🛠️ **Coming Soon**
:::
