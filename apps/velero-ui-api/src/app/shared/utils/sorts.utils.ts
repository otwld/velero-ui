import { V1Backup, V1Schedule } from '@velero-ui/velero';
import { KubernetesObject } from '@kubernetes/client-node';

export const sortAlphabetically = (
  a: string,
  b: string,
  ascending = true,
): number => (ascending ? a?.localeCompare(b) : -1 * a?.localeCompare(b));

export const sortDate = (a: Date, b: Date, ascending = true): number =>
  ascending ? a.getTime() - b.getTime() : b.getTime() - a.getTime();

export const sortObjects = <R extends KubernetesObject>(
  objects: R[],
  sortColumnName?: string,
  sortColumnAscending?: boolean,
): R[] => {
  switch (sortColumnName) {
    case 'Name':
      return objects.sort((a: R, b: R) =>
        sortAlphabetically(
          a.metadata.name,
          b.metadata.name,
          sortColumnAscending,
        ),
      );
    case 'Schedules':
      return objects.sort((a: R, b: R) =>
        sortAlphabetically(
          a.metadata?.labels['velero.io/schedule-name'],
          b.metadata?.labels['velero.io/schedule-name'],
          sortColumnAscending,
        ),
      );
    case 'Storage Locations':
      return objects.sort((a: V1Schedule, b: V1Schedule) =>
        sortAlphabetically(
          a.spec?.template?.storageLocation || 'z',
          b.spec?.template?.storageLocation || 'z',
          sortColumnAscending,
        ),
      );
    case 'Date':
      return objects.sort((a: V1Backup, b: V1Backup) =>
        sortDate(
          new Date(a.status?.startTimestamp),
          new Date(b.status?.startTimestamp),
          sortColumnAscending,
        ),
      );
    case 'Last Backup':
      return objects.sort((a: V1Schedule, b: V1Schedule) =>
        sortDate(
          new Date(a.status?.lastBackup),
          new Date(b.status?.lastBackup),
          sortColumnAscending,
        ),
      );
    case 'Expire In':
      return objects.sort((a: V1Backup, b: V1Backup) =>
        sortDate(
          new Date(a.status?.expiration),
          new Date(b.status?.expiration),
          sortColumnAscending,
        ),
      );
    default:
      return objects;
  }
};
