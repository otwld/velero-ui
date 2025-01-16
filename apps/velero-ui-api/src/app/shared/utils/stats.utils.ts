import { V1BackupPhase, V1RestorePhase } from '@velero-ui/velero';

export const getBackupsStatusColor = (label: V1BackupPhase): string => {
  switch (label) {
    case V1BackupPhase.New:
      return '#6C757D';
    case V1BackupPhase.FailedValidation:
      return '#DC3545';
    case V1BackupPhase.InProgress:
      return '#FFC107';
    case V1BackupPhase.WaitingForPluginOperations:
      return '#17A2B8';
    case V1BackupPhase.WaitingForPluginOperationsPartiallyFailed:
      return '#E0A800';
    case V1BackupPhase.Finalizing:
      return '#007BFF';
    case V1BackupPhase.FinalizingPartiallyFailed:
      return '#6610F2';
    case V1BackupPhase.Completed:
      return '#28A745';
    case V1BackupPhase.PartiallyFailed:
      return '#FD7E14';
    case V1BackupPhase.Failed:
      return '#C82333';
    case V1BackupPhase.Deleting:
      return '#6F42C1';
    default:
      return '#000000';
  }
};

export const getRestoresStatusColor = (label: V1RestorePhase): string => {
  switch (label) {
    case V1RestorePhase.New:
      return '#6C757D';
    case V1RestorePhase.FailedValidation:
      return '#DC3545';
    case V1RestorePhase.InProgress:
      return '#FFC107';
    case V1RestorePhase.WaitingForPluginOperations:
      return '#17A2B8';
    case V1RestorePhase.WaitingForPluginOperationsPartiallyFailed:
      return '#E0A800';
    case V1RestorePhase.Completed:
      return '#28A745';
    case V1RestorePhase.PartiallyFailed:
      return '#FD7E14';
    case V1RestorePhase.Failed:
      return '#C82333';
    default:
      return '#000000';
  }
};
