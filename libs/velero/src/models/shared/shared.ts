export interface V1DataMoveOperationProgress {
  totalBytes?: number;
  bytesDone?: number;
}

export interface V1Metadata {
  labels?: Partial<V1LabelsAnnotations>;
}

export interface V1SpecCredential {
  key: string;
  name: string;
}

export interface V1VolumePod {
  name: string;
  kind: string;
  namespace: string;
  uuid: string;
}

export interface V1LabelsAnnotations {
  'velero.io/backup-name'?: string;
  'velero.io/backup-uid'?: string;
  'velero.io/restore-name'?: string;
  'velero.io/schedule-name'?: string;
  'velero.io/restore-uid'?: string;
  'velero.io/pod-uid'?: string;
  'velero.io/pvc-uid'?: string;
  'velero.io/pod-volume-timeout'?: string;
  'velero.io/storage-location'?: string;
  'velero.io/volume-namespace'?: string;
  'velero.io/repository-type'?: string;
  'velero.io/data-upload'?: string;
  'velero.io/data-upload-snapshot-info'?: string;
  'velero.io/data-download'?: string;
  'velero.io/source-cluster-k8s-gitversion'?: string;
  'velero.io/source-cluster-k8s-major-version'?: string;
  'velero.io/source-cluster-k8s-minor-version'?: string;
  'velero.io/resource-timeout'?: string;
  'velero.io/async-operation-id'?: string;
  'velero.io/pvc-namespace-name'?: string;
  'velero.io/resource-usage'?: string;
  'backup.velero.io/backup-volumes'?: string;
  'backup.velero.io/backup-volumes-excludes'?: string;
  'snapshot.storage.kubernetes.io/is-default-class'?: string;
}


export enum NodeOS {
  Linux = 'linux',
  Windows = 'windows',
  auto = 'auto',
}
