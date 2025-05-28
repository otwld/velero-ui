import { Log, VeleroLog } from '@velero-ui/shared-types';

const execRegex = (regex: RegExp, line: string): string | null => {
  const result = regex.exec(line);

  if (result && result[1]) {
    return result[1].replace(/velero\//, '').replace(/\/plugins\//, '');
  }
  return null;
}

const parseValueGetters: Record<string, (line: string) => string | null>  = {
  plugin: (line) => execRegex(/plugin=([^\s]+)/, line),
  backupStorageLocation: (line) => execRegex(/backup-storage-location=([^\s]+)/, line) || execRegex(/backupLocation=([^\s]+)/, line) || execRegex(/bsl=([^\s]+)/, line),
  volumeSnapshotLocation: (line) => execRegex(/volume-snapshot-location=([^\s]+)/, line) || execRegex(/volumeSnapshotLocation=([^\s]+)/, line) || execRegex(/vsl=([^\s]+)/, line),
  backup: (line) => execRegex(/backup=([^\s]+)/, line),
  backupRepository: (line) => execRegex(/backupRepo=([^\s]+)/, line),
  podVolumeBackup: (line) => execRegex(/podvolumebackup=([^\s]+)/, line) || execRegex(/pvb=([^\s]+)/, line),
  podVolumeRestore: (line) => execRegex(/podvolumerestore=([^\s]+)/, line) || execRegex(/pvr=([^\s]+)/, line),
  namespace: (line) => execRegex(/namespace=([^\s]+)/, line),
  resource: (line) => execRegex(/resource=([^\s]+)/, line),
  group: (line) => execRegex(/group=([^\s]+)/, line),
  name: (line) => execRegex(/name=([^\s]+)/, line),
  logSource: (line) => execRegex(/logSource="([^"]+)"/, line),
  error: (line) => execRegex(/error="([^"]+)"/, line),
  expiration: (line) => execRegex(/error="([^"]+)"/, line),
  deleteBackupRequest: (line) => execRegex(/deleteBackupRequest=([^\s]+)/, line),
  serverStatusRequest: (line) => execRegex(/serverStatusRequest=([^\s]+)/, line),
  downloadRequest: (line) => execRegex(/downloadRequest=([^\s]+)/, line),
}

export const parseVeleroLog = (line: string): VeleroLog => {
  const regex = /time="([^"]+)"\s+level=([^\s]+)\s+msg="([^"]+)"/;

  const match = regex.exec(line);

  if (!match) {
    return null;
  }

  const [, time, level, msg] = match;

  const object = {
    date: time,
    level,
    message: msg,
    raw: line,
  }

  Object.entries(parseValueGetters).forEach(([key, value]) => {
    const getter = parseValueGetters[key];

    if (!getter) {
      return null;
    }

    const val = getter(line);
    if (val) {
      object[key] = val;
    }

  });
  return object;
};

export const parseVeleroUILog = (line: string): Log => {
  const object = JSON.parse(line);

  if (!object) {
    return null;
  }

  return {
    date: object.timestamp,
    level: object.level,
    message: object.message,
    raw: line,
  }
}
