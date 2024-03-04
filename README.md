# Velero Ui

A fully dashboard interface to interact with Velero.

### Quick look

<img src="https://cloud.outworld.fr/index.php/s/w6ILxVjIvXiEt7T/download">

### Requirements

**Velero server >= 1.13.0**

### Stack
 - Backend: NodeJs, NestJs
 - Frontend: VueJs, tailwindCSS

### Features
 - **Authentication:** Basic Auth / OpenID
 - **Dashboard:** Stats over Velero objects
 - **Settings:** Kubernetes cluster status, Velero server status, Node agents status, Plugins
 - **Velero:**
   - **Backups:** List, Describe, Create, Delete, Restore, Download Content, Download Logs
   - **Schedules:** List, Describe, Create, Edit, Delete, Toggle Pause
   - **Restore:** List, Describe, Create, Delete
   - **Backup Repositories:** List, Describe, Delete
   - **Backup Storage Locations:** List, Describe, Create, Edit, Delete
   - **Volume Snapshot Locations:** List, Describe, Delete
   - **Requests:** List, Describe, Delete

