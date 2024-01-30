export const enum BackupStatusPhase {
  New = 'New',
  FailedValidation = 'FailedValidation',
  InProgress = 'InProgress',
  WaitingForPluginOperations = 'WaitingForPluginOperations',
  WaitingForPluginOperationsPartiallyFailed = 'WaitingForPluginOperationsPartiallyFailed',
  Finalizing = 'Finalizing',
  FinalizingPartiallyFailed = 'FinalizingPartiallyFailed',
  Completed = 'Completed',
  PartiallyFailed = 'PartiallyFailed',
  Failed = 'Failed',
  Deleting = 'Deleting',
}
