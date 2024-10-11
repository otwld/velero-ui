# Velero UI Helm Chart

![GitHub License](https://img.shields.io/github/license/otwld/velero-ui)
[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/velero-ui)](https://artifacthub.io/packages/helm/otwld/velero-ui)
![Build Status](https://github.com/otwld/velero-ui/actions/workflows/cd.yml/badge.svg)
[![Discord](https://img.shields.io/badge/Discord-OTWLD-blue?logo=discord&logoColor=white)](https://discord.gg/U24mpqTynB)


A fully lightweight dashboard interface to interact with [Velero (vmware-tanzu)](https://github.com/vmware-tanzu/velero/issues).

This Chart is for deploying [Velero UI](https://github.com/otwld/velero-ui). 

## Requirements

- Kubernetes: `>= 1.16.0-0`

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

## Helm Values

- See [values.yaml](values.yaml) to see the Chart's default values.

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity for pod assignment |
| autoscaling.enabled | bool | `false` | Enable autoscaling |
| autoscaling.maxReplicas | int | `100` | Number of maximum replicas |
| autoscaling.minReplicas | int | `1` | Number of minimum replicas |
| autoscaling.targetCPUUtilizationPercentage | int | `80` | CPU usage to target replica |
| configuration.general.grafanaUrl | string | `""` | Add an URL to a grafana Dashboard |
| configuration.general.secretPassPhrase.annotations | object | `{}` | Annotations to add to the secret |
| configuration.general.secretPassPhrase.existingSecret | string | `""` | Name of a pre-existing secret (if any) |
| configuration.general.secretPassPhrase.key | string | `"pass_phrase"` | key in the secret containing the passphrase |
| configuration.general.secretPassPhrase.name | string | `""` | Name of the secret to create if `useSecret` is true and `existingSecret` is empty |
| configuration.general.secretPassPhrase.useSecret | bool | `false` | Whether a secret should be used. |
| configuration.general.secretPassPhrase.value | string | `"this is not a secret passphrase"` | Value of the secret pass phrase, must be changed. if `useSecret` is true and `existingSecret` is empty, this value will be stored in secret at first deployment |
| configuration.general.veleroNamespace | string | `"velero"` | Define the velero namespace By default velero is deployed in "velero" namespace |
| configuration.logLevel | string | `"info"` | Define the logger level Allowed values: debug, info, error |
| env | list | `[]` | Additional environments variables on the output Deployment definition. |
| envFrom | list | `[]` (See [values.yaml]) | envFrom to pass to all deployed Deployments. |
| extraArgs | list | `[]` | Additional arguments on the output Deployment definition. |
| fullnameOverride | string | `""` | String to fully override template |
| image.pullPolicy | string | `"IfNotPresent"` | Docker pull policy |
| image.repository | string | `"otwld/velero-ui"` | Docker image registry |
| image.tag | string | `""` | Docker image tag, overrides the image tag whose default is the chart appVersion. |
| imagePullSecrets | list | `[]` | Docker registry secret names as an array |
| ingress.annotations | object | `{}` | Additional annotations for the Ingress resource. |
| ingress.className | string | `""` | IngressClass that will be used to implement the Ingress (Kubernetes 1.18+) |
| ingress.enabled | bool | `false` | Enable ingress controller resource |
| ingress.hosts[0].host | string | `"velero-ui.local"` |  |
| ingress.hosts[0].paths[0].path | string | `"/"` |  |
| ingress.hosts[0].paths[0].pathType | string | `"Prefix"` |  |
| ingress.tls | list | `[]` | The tls configuration for hostnames to be covered with this ingress record. |
| livenessProbe.enabled | bool | `true` | Enable livenessProbe |
| livenessProbe.failureThreshold | int | `6` | Failure threshold for livenessProbe |
| livenessProbe.initialDelaySeconds | int | `60` | Initial delay seconds for livenessProbe |
| livenessProbe.path | string | `"/health"` | Request path for livenessProbe |
| livenessProbe.periodSeconds | int | `10` | Period seconds for livenessProbe |
| livenessProbe.successThreshold | int | `1` | Success threshold for livenessProbe |
| livenessProbe.timeoutSeconds | int | `5` | Timeout seconds for livenessProbe |
| nameOverride | string | `""` | String to partially override template  (will maintain the release name) |
| nodeSelector | object | `{}` | Node labels for pod assignment. |
| podAnnotations | object | `{}` | Map of annotations to add to the pods |
| podLabels | object | `{}` | Map of labels to add to the pods |
| podSecurityContext | object | `{}` | Pod Security Context |
| rbac.clusterAdministrator | bool | `true` | Whether to create the cluster role binding to give administrator permissions to Velero-ui |
| rbac.clusterAdministratorName | string | `"cluster-admin"` | Name of the ClusterRole. |
| rbac.create | bool | `true` | Whether to create the Velero-ui role and role binding to give all permissions to the namespace to Velero-ui. |
| readinessProbe.enabled | bool | `true` | Enable readinessProbe |
| readinessProbe.failureThreshold | int | `6` | Failure threshold for readinessProbe |
| readinessProbe.initialDelaySeconds | int | `30` | Initial delay seconds for readinessProbe |
| readinessProbe.path | string | `"/health"` | Request path for readinessProbe |
| readinessProbe.periodSeconds | int | `5` | Period seconds for readinessProbe |
| readinessProbe.successThreshold | int | `1` | Success threshold for readinessProbe |
| readinessProbe.timeoutSeconds | int | `3` | Timeout seconds for readinessProbe |
| replicaCount | int | `1` | Number of replicas |
| resources.limits | object | `{}` | Pod limit |
| resources.requests | object | `{}` | Pod requests |
| runtimeClassName | string | `""` | Specify runtime class |
| securityContext | object | `{}` | Container Security Context |
| service.port | int | `3000` | Service port |
| service.type | string | `"ClusterIP"` | Service type |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.automount | bool | `true` | Automatically mount a ServiceAccount's API credentials? |
| serviceAccount.create | bool | `true` | Specifies whether a service account should be created |
| serviceAccount.name | string | `""` | The name of the service account to use. If not set and create is true, a name is generated using the fullname template |
| tolerations | list | `[]` | Tolerations for pod assignment |
| volumeMounts | list | `[]` | Additional volumeMounts on the output Deployment definition. |
| volumes | list | `[]` | Additional volumes on the output Deployment definition. |

----------------------------------------------

## Support

- For questions, suggestions, and discussion about Velero please refer to
  the [Velero issue page](https://github.com/vmware-tanzu/velero/issues)
- For questions, suggestions, and discussion about Velero UI please
  visit [Velero-ui issue page](https://github.com/otwld/velero-ui/issues) or join our [OTWLD Discord](https://discord.gg/U24mpqTynB)
