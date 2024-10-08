# Velero UI

![GitHub License](https://img.shields.io/github/license/otwld/velero-ui)
[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/velero-ui)](https://artifacthub.io/packages/helm/otwld/velero-ui)
![Build Status](https://github.com/otwld/velero-ui/actions/workflows/cd.yml/badge.svg)
[![Discord](https://img.shields.io/badge/Discord-OTWLD-blue?logo=discord&logoColor=white)](https://discord.gg/U24mpqTynB)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/otwld/velero-ui?label=docker%20image)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/otwld/velero-ui/latest)

### ℹ️ **ALPHA 0.2.0** is coming soon ℹ️

A fully lightweight dashboard interface to interact with [Velero (vmware-tanzu)](https://github.com/vmware-tanzu/velero/issues).

This dashboard implement the same functionalities as the velero CLI.

### Quick look

<img src="/images/screenshots.gif">

### Requirements

- **Velero server >= 1.13.0**

> ⚠️ This dashboard has only been tested on version **1.13.x** and **1.14.x**, using an older version may cause bugs with an outdated or
> unmanaged API

### Features and comparisons with velero CLI

| Functionnalities                                                                                                  | Velero CLI | Velero UI |
|-------------------------------------------------------------------------------------------------------------------|:----------:|:---------:|
| **Backups** <br/>(List, Describe, Create, Delete, Logs, Restore, Download Content, Download Logs)                 |     ✅      |    🚧     |
| **Schedules** <br/>(List, Describe, Create, Edit, Delete, Toggle Pause)                                           |     ✅      |    🚧     |
| **Restore**   <br/>     (List, Describe, Create, Delete)                                                          |     ✅      |    🚧     |
| **Backup Repositories**     <br/>                  (List, Describe, Delete)                                       |     ❎      |     ✅     |
| **Backup Storage Locations**      <br/>            (List, Describe, Create, Edit, Delete)                         |     ✅      |    🚧     |
| **Volume Snapshot Locations**    <br/>                (List, Describe, Delete)                                    |     ✅      |    🚧     |
| **Requests** <br/> (List, Describe, Delete)                                                                       |     ❎      |     ✅     |
| **Plugins** <br/> (List, Add, Delete)                                                                             |     ✅      |    🚧     |
| **Settings**     <br/> (Cluster status, velero status, node agent status)                                         |     ❎      |     ✅     |
| **Dashboard**   <br/> (Resources statistics)                                                                      |     ❎      |     ✅     |
| **Authentication**    <br/> (Classic, Oauth2/OpenID, Github, Gitlab, Google, Microsoft, LDAP)                     |     ❎      |     ✅     |
| **Permissions and roles**    <br/> (Restric resources access to users or groups based on external auth providers) |     ❎      |    🚧     |

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
kubectl port-forward service/velero-ui 3333:80 -n velero-ui
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

| Name                        | Default Value                 | Allowed values         | Description                          |
|-----------------------------|-------------------------------|------------------------|--------------------------------------|
| **Global**                  |                               |                        |                                      |
| LOG_LEVEL                   | `info`                        | `debug` `info` `error` | Logger level                         |
| PORT                        | `3000`                        |                        | API port                             |
| VELERO_NAMESPACE            | `velero`                      |                        | Namespace where velero runs          |
| AUTH_SECRET_PASSPHRASE           | `this is a secret passphrase` |                        | Secret for JWT, **must be changed**  |
| KUBE_CONFIG_PATH            | ` `                           |                        | Path to the kube config              |
| KUBE_CONTEXT                | ` `                           |                        | Context to use                       |
| GRAFANA_URL                 | ` `                           |                        | Add a link to your Grafana Dashboard |
| **Built in Auth**           | ` `                           |                        |                                      |
| BASIC_AUTH_ENABLED          | `true`                        |                        | Enable builtin auth                  |
| BASIC_AUTH_USERNAME         | `admin`                       |                        | Username                             |
| BASIC_AUTH_PASSWORD         | `admin`                       |                        | Password                             |
| AUTH_SESSION_DURATION | `1h`                          |                        | Session duration                     |
| **LDAP**                    |                               |                        |                                      |
| LDAP_ENABLED                | `false`                       |                        | Enable LDAP                          |
| LDAP_URL                    | ` `                           | `ldap://` `ldaps://`   | LDAP URL                             |
| LDAP_BIND_DN                | ` `                           |                        | Bind DN                              |
| LDAP_BIND_CREDENTIALS       | ` `                           |                        | Credentials                          |
| LDAP_SEARCH_BASE            | ` `                           |                        | BASE DN                              |
| LDAP_SEARCH_FILTER          | `(uid={{username}})`          |                        | Search filters                       |
| LDAP_SEARCH_ATTRIBUTES      | ` `                           |                        | Attributes                           |
| **DEVELOPMENT ONLY**        |                               |                        |                                      |
| NODE_ENV                    | `development`                 |                        | Node environment                     |
| BASE_URL                    | `http://localhost:4200`       |                        | Base url for the WEBAPP in local     |
| VITE_API_PORT               | `4200`                        |                        | Local webapp PORT                    |
| VITE_API_URL                | `http://localhost:3000/api`   |                        | Local API URL                        |

## Local development

✨ This workspace works with [Nx, Smart Monorepos · Fast CI.](https://nx.dev/) ✨

#### Stack

- Backend: NodeJs, NestJs
- Frontend: VueJs, tailwindCSS

#### Requirements

- Node >= 20
- Typescript >= 5.0.0
- NPM
- Nx workspace >= 19.0.0

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
npm install -g nx@latest
```

3. Install dependencies with npm

```bash
npm install
```

4. Edit the .env.development, you can find references [HERE](#environment-variables)

### Serve

- Serve the API

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
  visit [Velero-ui issue page](https://github.com/otwld/velero-ui/issues) or join our [OTWLD Discord](https://discord.gg/U24mpqTynB)
