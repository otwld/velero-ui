![otwld_velero_ui_banner](./banner.png)

![GitHub License](https://img.shields.io/github/license/otwld/velero-ui)
[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/velero-ui)](https://artifacthub.io/packages/helm/otwld/velero-ui)
![Build Status](https://github.com/otwld/velero-ui/actions/workflows/apps-cd.yml/badge.svg)
[![Discord](https://img.shields.io/badge/Discord-OTWLD-blue?logo=discord&logoColor=white)](https://discord.gg/U24mpqTynB)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/otwld/velero-ui?label=docker%20image)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/otwld/velero-ui/latest)

### ℹ️ **ALPHA 0.3.0** ℹ️

A fully realtime lightweight dashboard interface to interact with [Velero (vmware-tanzu)](https://github.com/vmware-tanzu/velero/issues).

This dashboard implement the same functionalities as the velero CLI.

## 👀 Quick look

<img src="/images/screenshots.gif">

## ⭐ Velero UI Features

### Interface

- 🔒 **Authentication:** Secure dashboard with multiple authentication methods.
- 🔍 **Resource Management:** Search, sort, and perform quick actions on Velero resources.
- ⚠️ **Action Confirmation:** Double-check confirmation modals for critical actions.
- 🧩 **Intuitive Forms:** Step-by-step form wizard for easy resource creation and edition.
- 📄 **Detailed Resource Pages:** Each resource has a dedicated page displaying specifications, status, manifests, and logs.
- 🏳️ **Languages**: Multi languages are available.

### Authentication

- 🔑 **Built-in Authentication:** Velero UI is secured by default with username and password credentials.
- 🌐 **Federated Authentication:** Supports up to five external authentication providers, including GitHub, GitLab, Google, Microsoft, and generic OAuth/OpenID.
- 📂 **LDAP Integration:** Configure Velero UI to integrate with your existing LDAP system.

### Statistics

- 📊 **Global Overview:** View summaries of your Velero resources (backups, schedules, restores, etc.).
- 📈 **Charts and Visualizations:** Track resource status and success rates with visual metrics.

### Advanced Settings

- 🖥️ **Cluster Info:** Access basic information about the cluster running the Velero Server.
- 📝 **Logs:** Real-time log monitoring for Velero Server and Node Agents.

### Technical

- ⚡ **Optimized Performance:** Velero UI leverages caching for fast performance and quick rendering.
- 📱 **Responsive Design:** Fully functional on mobile devices and tablets.


## 📋 Requirements

- **Velero server >= 1.13.0**

> ⚠️ This dashboard has only been tested on version **1.13.x**, **1.14.x** and **1.15.x**, using an older version may cause bugs with an outdated or
> unmanaged API

## 📚 Documentation

Want to learn more about Velero UI's features? Check out [Velero UI documentation](https://velero-ui.docs.otwld.com) for a comprehensive overview!

## 🚀 Deployments

- [🐳 **Getting Started with Docker**](https://velero-ui.docs.otwld.com/getting-started/docker)
- [☸️ **Getting Started with Helm Chart**](https://velero-ui.docs.otwld.com/getting-started/getting-started/helm)
- [⚙️ **Getting Started with Kubernetes**](https://velero-ui.docs.otwld.com/getting-started/getting-started/kubernetes)


## 🛠️ Support

- For questions, suggestions, and discussion about Velero please refer to
  the [Velero issue page](https://github.com/vmware-tanzu/velero/issues)
- For questions, suggestions, and discussion about Velero UI please
  visit [Velero-ui issue page](https://github.com/otwld/velero-ui/issues) or join our [OTWLD Discord](https://discord.gg/U24mpqTynB)
