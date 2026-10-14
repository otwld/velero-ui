---
sidebar_position: 1
slug: /features
title: ⭐ Features
hide_title: true
---

## ⭐ Features

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

## Snapshot and data mover progress

The backup details page displays filesystem volumes, CSI snapshots, native snapshots, and data mover uploads in the backed-up volumes panel. Data mover entries show the source PVC, snapshot reference and ID, phase, byte progress, and failure messages. Restore details also show data mover downloads and their target PVCs. Volume progress refreshes every five seconds while the panel is open.

Backup status shows completed/attempted item operations, failed operations, and CSI/native snapshot counts. CSI snapshot details come from live Kubernetes objects while the backup runs and from Velero backup metadata once it finishes, so temporary snapshot cleanup does not remove the archived details. Native snapshot details are available after the backup finishes.

The dedicated Pod Volume Backups and Pod Volume Restores menus combine filesystem volumes with data mover uploads/downloads. Search, status and backup filters, sorting, pagination, and refresh apply to the combined list. Each data mover row links to its progress and original manifest; restore rows display the target PVC namespace and parent restore. Filesystem volumes retain their delete actions.
