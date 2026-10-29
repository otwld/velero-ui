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

The backup details page displays filesystem volumes, CSI snapshots, native snapshots, and data mover uploads in the backed-up volumes panel. Data mover entries show the source PVC, snapshot reference and ID, phase, byte progress, and failure messages. Restore details also show data mover downloads and their target PVCs. Filesystem and data mover operations are read through Kubernetes selectors for the current backup/restore, then maintained through parent-scoped WebSockets. The panel does not periodically reload global operation collections. Snapshot metadata is refreshed every five seconds while a backup is running and stops refreshing after completion.

Backup status shows completed/attempted item operations, failed operations, and CSI/native snapshot counts. CSI snapshot details come from live Kubernetes objects while the backup runs and from Velero backup metadata once it finishes, so temporary snapshot cleanup does not remove the archived details. Native snapshot details are available after the backup finishes.

For completed backups, the panel reads `BackupVolumeInfos` and falls back to or enriches it with historical snapshot metadata when available. The format of each backup matters independently of the current server version: a backup created before an upgrade keeps its original metadata format.

| Backup creation version | Archived snapshot information |
| --- | --- |
| Velero 1.13 | VolumeInfos is available, but asynchronous results and some later fields can be missing. Historical metadata is used when available; missing state or size is shown as unknown. |
| Velero 1.14–1.16 | VolumeInfos is preferred; older separate CSI/native metadata remains readable. |
| Velero 1.17–1.18 | VolumeInfos is used because the separate CSI VolumeSnapshot and VolumeSnapshotContent files are no longer written. |

When a source cannot be retrieved, the panel keeps the available results and displays an incomplete-information warning. A missing optional source is distinguished from a retrieval error; permission failures, storage outages and invalid metadata are not treated as successful empty results. Byte totals include each displayed volume once and indicate unknown sizes or known bytes only when information is incomplete. Archived snapshot data does not invent live transfer progress.

DataUpload and DataDownload progress uses the live `velero.io/v2alpha1` resources. If those CRDs are absent, their lists are empty and filesystem volumes remain available. Archived volume information can survive after a live DataUpload is removed; the dedicated data mover menus still show live resources only. Versions below 1.13 and future versions beyond the documented range are not guaranteed compatible merely because these API calls return no data.

Compatibility regressions use metadata fixtures sourced from Velero release tags 1.13.0 through 1.18.0 and simulated Kubernetes/storage responses. These tests do not replace validation on a real cluster for each version and storage provider.

The dedicated Pod Volume Backups and Pod Volume Restores menus combine filesystem volumes with data mover uploads/downloads. The API applies search, filters, sorting and pagination to the combined authorized resources and returns only the requested page (20 rows by default, at most 100), its total and available filters. WebSocket updates send the current page and updated total without periodic polling or loading animations. A shared server cache maintains one Kubernetes snapshot/watch per source, including authorized parent restores; changing pages or receiving progress events does not list all resources again. The server releases unused caches and watches after 30 seconds. Reconnecting or pressing Refresh resynchronizes the current page; an expired Kubernetes resource version refreshes the affected server source. Source failures remain visible while other sources can still render. Each data mover row links to its progress and original manifest; restore rows display the target PVC namespace and parent restore. Filesystem volumes retain their delete actions.

Transient snapshot reload failures after a watch expiration are retried automatically while the source has active subscribers, with increasing delays capped at 30 seconds. Kubernetes watch connections also retry temporary timeouts and throttling. Healthy sources stay on WebSockets; permission denials and missing CRDs are not retried in a periodic loop. Detail-panel requests also keep retrying transient failures with delays capped at 30 seconds while mounted; retries are cancelled on parent changes or unmount, and stop after successful recovery.
