# Velero Ui

![GitHub License](https://img.shields.io/github/license/otwld/velero-ui)
[![Build Status](https://drone.outworld.fr/api/badges/otwld/velero-ui/status.svg)](https://drone.outworld.fr/otwld/velero-ui)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/otwld/velero-ui?label=docker%20image)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/otwld/velero-ui/latest)

🚧 **WORK IN PROGRESS** 🚧

A fully dashboard interface to interact with [Velero (vmware-tanzu)](https://github.com/vmware-tanzu/velero/issues).

This dashboard aims to implement the same functionalities as the velero CLI.

### Quick look

<img src="https://cloud.outworld.fr/index.php/s/w6ILxVjIvXiEt7T/download">

### Requirements

- **Velero server >= 1.13.0**

> ⚠️ This dashboard has only be tested on version **1.13.x**, using an older version may cause bugs with an outdated and
unmanaged API ⚠️

### Features and comparisons with velero CLI

| Functionnalities                                                                                  | Velero CLI | Velero UI |
|---------------------------------------------------------------------------------------------------|:----------:|:---------:|
| **Backups** <br/>(List, Describe, Create, Delete, Logs, Restore, Download Content, Download Logs) |     ✅      |    🚧     |
| **Schedules** <br/>(List, Describe, Create, Edit, Delete, Toggle Pause)                           |     ✅      |    🚧     |
| **Restore**   <br/>     (List, Describe, Create, Delete)                                          |     ✅      |    🚧     |
| **Backup Repositories**     <br/>                  (List, Describe, Delete)                       |     ❎      |    🚧     |
| **Backup Storage Locations**      <br/>            (List, Describe, Create, Edit, Delete)         |     ✅      |     ✅     |
| **Volume Snapshot Locations**    <br/>                (List, Describe, Delete)                    |     ✅      |    🚧     |
| **Requests** <br/> (List, Describe, Delete)                                                       |     ❎      |    🚧     |
| **Plugins** <br/> (List, Add, Delete)                                                             |     ✅      |    🚧     |
| **Settings**     <br/> (Cluster status, velero status, node agent status)                         |     ❎      |     ✅     |
| **Dashboard**   <br/> (Resources statistics)                                                      |     ❎      |     ✅     |
| **Authentication**    <br/> (Classic, OpenID, LDAP)                                               |     ❎      |    🚧     |

## Deployments

### Using Docker

Starting Velero ui is simple:

1. Locate your Kube Config, default location is in `~/.kube/config`
2. Run this docker command with your Kube config path, you can also specify context using [environment variable](#environment-variables) `KUBE_CONTEXT`
```bash
docker run --name velero-ui -v ~/.kube/config:/app/.kube/config -e KUBE_CONFIG_PATH=/app/.kube/config -d -p 3333:3000 otwld/velero-ui:latest
```
3. Velero-ui is now reachable at `http://localhost:3333`

### Using Kubernetes

All kubernetes manifests are located in [kubernetes/manifests](kubernetes/manifests), default namespace used
is `velero-ui`

1. Edit manifests, [environment variables](#environment-variables) can be defined in [kubernetes/manifests/deployment.yml](kubernetes/manifests/deployment.yml)
2. Apply manifests with kubectl
```bash
kubectl apply -f kubernetes/manifests
```
3. Access via kube-proxy
```bash
kubectl port-forward service/velero-ui 3334:80 -n velero-ui
```
4. Velero-ui is now reachable at `http://localhost:3333`

### Using Helm Chart

> Helm chart is not deployed yet on artifacthub


#### Deploying Velero UI chart

To install the `velero-ui` chart in the `velero-ui` namespace:

```console
helm repo add otwld https://otwld.github.io/helm-charts/
helm repo update
helm install velero-ui otwld/velero-ui --namespace velero-ui
```

#### Upgrading Velero UI chart

Make adjustments to your values as needed, then run `helm upgrade`:

```console
# -- This pulls the latest version of the velero-ui chart from the repo.
helm repo update
helm upgrade velero-ui olwld/velero-ui --namespace velero-ui --values values.yaml
```

#### Uninstalling Velero UI chart

To uninstall/delete the `velero-ui` deployment in the `velero-ui` namespace:

```console
helm delete velero-ui --namespace velero-ui
```

Substitute your values if they differ from the examples. See `helm delete --help` for a full reference on `delete` parameters and flags.


## Environment variables

| Name                   | Default Value                 | Allowed values         | Description                          |
|------------------------|-------------------------------|------------------------|--------------------------------------|
| **Global**             |                               |                        |                                      |
| LOG_LEVEL              | `info`                        | `debug` `info` `error` | Logger level                         |
| PORT                   | `3000`                        |                        | API port                             |
| VELERO_NAMESPACE       | `velero`                      |                        | Namespace where velero runs          |
| SECRET_PASSPHRASE      | `this is a secret passphrase` |                        | Secret for JWT, must be changed      |
| KUBE_CONFIG_PATH       | ` `                           |                        | Path to the kube config              |
| KUBE_CONTEXT           | ` `                           |                        | Context to use                       |
| GRAFANA_URL            | ` `                           |                        | Add a link to your Grafana Dashboard |
| **Built in Auth**      | ` `                           |                        |                                      |
| BASIC_AUTH_ENABLED     | `true`                        |                        | Enable builtin auth                  |
| BASIC_AUTH_USERNAME    | `admin`                       |                        | Username                             |
| BASIC_AUTH_PASSWORD    | `admin`                       |                        | Password                             |
| **OIDC via PKCE**      |                               |                        |                                      |
| OIDC_ENABLED           | `false`                       |                        | Enable OIDC                          |
| OIDC_AUTHORITY         | ` `                           |                        | Authority URL server                 |
| OIDC_CLIENT_ID         | ` `                           |                        | Client ID                            |
| OIDC_JWKS_URI          | ` `                           |                        | JWKs URI URL                         |
| OIDC_SCOPES            | ` `                           |                        | Scopes                               |
| **LDAP**               |                               |                        |                                      |
| LDAP_ENABLED           | `false`                       |                        | Enable LDAP                          |
| LDAP_URL               | ` `                           | `ldap://` `ldaps://`   | LDAP URL                             |
| LDAP_BIND_DN           | ` `                           |                        | Bind DN                              |
| LDAP_BIND_CREDENTIALS  | ` `                           |                        | Credentials                          |
| LDAP_SEARCH_BASE       | ` `                           |                        | BASE DN                              |
| LDAP_SEARCH_FILTER     | `(uid={{username}})`          |                        | Search filters                       |
| LDAP_SEARCH_ATTRIBUTES | ` `                           |                        | Attributes                           |
| **DEVELOPMENT ONLY**   |                               |                        |                                      |
| NODE_ENV               | `development`                 |                        | Node environment                     |
| BASE_URL               | `http://localhost:4200`       |                        | Base url for the WEBAPP in local     |
| VITE_API_PORT          | `4200`                        |                        | Local webapp PORT                    |
| VITE_API_URL           | `http://localhost:3000/api`   |                        | Local API URL                        |

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

4. Edit the .env.development, you can find references [HERE](#environment-variables)

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
