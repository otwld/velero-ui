import { ScheduleStatusPhase } from './schedule.enums';

export interface Schedule {
  apiVersion: string;
  kind: string;
  metadata: ScheduleMetadata;
  spec: ScheduleSpec;
  status: ScheduleStatus;
}

export interface ScheduleMetadata {
  annotations: object;
  creationTimestamp: string;
  generation: number;
  labels: object;
  managedFields: any[];
  name: string;
  namespace: string;
  resourceVersion: string;
  uid: string;
}

export interface ScheduleSpec {
  schedule: string;
  template: ScheduleTemplate;
  useOwnerReferencesInBackup: boolean;
  paused: boolean;
}

export interface ScheduleTemplate {
  defaultVolumesToRestic: boolean;
  excludedNamespaces: any;
  excludedResources: any;
  includeClusterResources: boolean;
  includedNamespaces: string[];
  includedResources: string[];
  metadata: ScheduleTemplateMetadata;
  snapshotVolumes: boolean;
  storageLocation: string;
  ttl: string;
  volumeSnapshotLocations: string[];
}

export interface ScheduleTemplateMetadata {
  labels: object;
}

export interface ScheduleStatus {
  lastBackup: string;
  phase: ScheduleStatusPhase;
}
