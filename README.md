# Velero Ui

![GitHub License](https://img.shields.io/github/license/otwld/velero-ui)
[![Build Status](https://drone.outworld.fr/api/badges/otwld/velero-ui/status.svg)](https://drone.outworld.fr/otwld/velero-ui)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/otwld/velero-ui?label=docker%20image)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/otwld/velero-ui/latest)

🚧 **WORK IN PROGRESS** 🚧

A fully dashboard interface to interact with [Velero (vmware-tanzu)](https://github.com/vmware-tanzu/velero/issues).

This dashboard aims to implement the same functionnalities as the velero CLI.

### Quick look

<img src="https://cloud.outworld.fr/index.php/s/w6ILxVjIvXiEt7T/download">

### Requirements

- **Velero server >= 1.13.0**

⚠️ This dashboard has only be tested on version **1.13.x**, using an older version may cause bugs with an outdated and
unmanaged API ⚠️

### Features and comparison with velero CLI

| Functionnalities                                                                                  | Velero CLI | Velero UI |
|---------------------------------------------------------------------------------------------------|:----------:|:---------:|
| **Backups** <br/>(List, Describe, Create, Delete, Logs, Restore, Download Content, Download Logs) |     ✅      |     🚧     |
| **Schedules** <br/>(List, Describe, Create, Edit, Delete, Toggle Pause)                           |     ✅      |     🚧     |
| **Restore**   <br/>     (List, Describe, Create, Delete)                                          |     ✅      |     🚧     |
| **Backup Repositories**     <br/>                  (List, Describe, Delete)                       |     ❎      |     ✅     |
| **Backup Storage Locations**      <br/>            (List, Describe, Create, Edit, Delete)         |     ✅      |     ✅     |
| **Volume Snapshot Locations**    <br/>                (List, Describe, Delete)                    |     ✅      |     🚧     |
| **Requests** <br/> (List, Describe, Delete)                                                       |     ❎      |     🚧     |
| **Plugins** <br/> (List, Add, Delete)                                                             |     ✅      |    🚧     |
| **Settings**     <br/> (Cluster status, velero status, node agent status)                         |     ❎      |     ✅     |
| **Dashboard**   <br/> (Resources statistics)                                                      |     ❎      |     ✅     |
| **Authentication**    <br/> (Classic, OpenID, LDAP)                                                   |      ❎      |     🚧      |

## Deployments

### Using Docker
*WIP*

### Using Kubernetes
*WIP*

### Using Helm Chart
*WIP*

## Local development

✨ This workspace works with [Nx, Smart Monorepos · Fast CI.](https://nx.dev/) ✨

#### Stack

- Backend: NodeJs, NestJs
- Frontend: VueJs, tailwindCSS

#### Requirements

- Node >= 20
- Typescript >= 5.0.0
- Yarn
- Nx workspace >= 17.0.0

#### Installation

1. Clone the repository

```bash
git clone git@github.com:otwld/velero-ui.git
```

2. Install NX

```bash
npm add --global nx@latest
```

or

```bash
yarn global add nx@latest
```

3. Install dependencies with yarn

```bash
yarn install
```

4. Edit the .env.development

```bash
...

NODE_ENV=development
VELERO_NAMESPACE=velero
KUBE_CONFIG_PATH=
SECRET_PASSPHRASE="this is a secret passphrase"

...
```

### Serve

- Server the API

```bash
nx serve velero-ui-api
```

- Serve the APP

```bash
nx serve velero-ui
```

### Build

- Build the API

```bash
nx build velero-ui-api
```

- Build the APP

```bash
nx build velero-ui
```

## Support

- For questions, suggestions, and discussion about Velero please refer to
  the [Velero issue page](https://github.com/vmware-tanzu/velero/issues)
- For questions, suggestions, and discussion about Velero UI please
  visite [Velero-ui issue page](https://github.com/otwld/velero-ui/issues)
