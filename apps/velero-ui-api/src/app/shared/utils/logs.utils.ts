import { Log, VeleroLog } from '@velero-ui/shared-types';

const cleanValue = (value: string): string =>
  value.replace(/velero\//, '').replace(/\/plugins\//, '');

const execRegex = (regex: RegExp, line: string): string | null => {
  const result = regex.exec(line);

  if (result && result[1]) {
    return cleanValue(result[1]);
  }
  return null;
};

const parseValueGetters: Record<string, (line: string) => string | null> = {
  plugin: (line) => execRegex(/plugin=([^\s]+)/, line),
  backupStorageLocation: (line) =>
    execRegex(/backup-storage-location=([^\s]+)/, line) ||
    execRegex(/backupLocation=([^\s]+)/, line) ||
    execRegex(/bsl=([^\s]+)/, line),
  volumeSnapshotLocation: (line) =>
    execRegex(/volume-snapshot-location=([^\s]+)/, line) ||
    execRegex(/volumeSnapshotLocation=([^\s]+)/, line) ||
    execRegex(/vsl=([^\s]+)/, line),
  backup: (line) => execRegex(/backup=([^\s]+)/, line),
  backupRepository: (line) => execRegex(/backupRepo=([^\s]+)/, line),
  podVolumeBackup: (line) =>
    execRegex(/podvolumebackup=([^\s]+)/, line) ||
    execRegex(/pvb=([^\s]+)/, line),
  podVolumeRestore: (line) =>
    execRegex(/podvolumerestore=([^\s]+)/, line) ||
    execRegex(/pvr=([^\s]+)/, line),
  namespace: (line) => execRegex(/namespace=([^\s]+)/, line),
  resource: (line) => execRegex(/resource=([^\s]+)/, line),
  group: (line) => execRegex(/group=([^\s]+)/, line),
  name: (line) => execRegex(/name=([^\s]+)/, line),
  logSource: (line) => execRegex(/logSource="([^"]+)"/, line),
  error: (line) => execRegex(/error="([^"]+)"/, line),
  expiration: (line) => execRegex(/error="([^"]+)"/, line),
  deleteBackupRequest: (line) =>
    execRegex(/deleteBackupRequest=([^\s]+)/, line),
  serverStatusRequest: (line) =>
    execRegex(/serverStatusRequest=([^\s]+)/, line),
  downloadRequest: (line) => execRegex(/downloadRequest=([^\s]+)/, line),
};

/**
 * Keys emitted by Velero with `--log-format=json` (logrus JSONFormatter).
 * They are the same logrus fields matched by `parseValueGetters`, except the
 * error message, which Velero writes to `error.message` in JSON mode.
 */
const jsonValueKeys: Partial<Record<keyof VeleroLog, string[]>> = {
  plugin: ['plugin'],
  backupStorageLocation: ['backup-storage-location', 'backupLocation', 'bsl'],
  volumeSnapshotLocation: [
    'volume-snapshot-location',
    'volumeSnapshotLocation',
    'vsl',
  ],
  backup: ['backup'],
  backupRepository: ['backupRepo'],
  podVolumeBackup: ['podvolumebackup', 'pvb'],
  podVolumeRestore: ['podvolumerestore', 'pvr'],
  namespace: ['namespace'],
  resource: ['resource'],
  group: ['group'],
  name: ['name'],
  logSource: ['logSource'],
  error: ['error.message', 'error'],
  expiration: ['expiration'],
  deleteBackupRequest: ['deleteBackupRequest'],
  serverStatusRequest: ['serverStatusRequest'],
  downloadRequest: ['downloadRequest'],
};

const parseVeleroJsonLog = (line: string): VeleroLog | null => {
  let entry: unknown;

  try {
    entry = JSON.parse(line);
  } catch {
    return null;
  }

  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return null;
  }

  const fields = entry as Record<string, unknown>;

  if (typeof fields.level !== 'string' || typeof fields.msg !== 'string') {
    return null;
  }

  const object: VeleroLog = {
    date: typeof fields.time === 'string' ? fields.time : undefined,
    level: fields.level,
    message: fields.msg,
    raw: line,
  };

  Object.entries(jsonValueKeys).forEach(([key, jsonKeys]) => {
    const value = jsonKeys
      .map((jsonKey) => fields[jsonKey])
      .find((val): val is string => typeof val === 'string' && val !== '');

    if (value) {
      object[key] = cleanValue(value);
    }
  });

  return object;
};

export const parseVeleroLog = (line: string): VeleroLog => {
  try {
    if (line.trim().startsWith('{')) {
      const jsonLog = parseVeleroJsonLog(line);

      if (jsonLog) {
        return jsonLog;
      }
    }

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
    };

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
  } catch (error) {
    return null;
  }
};

export const parseVeleroUILog = (line: string): Log => {
  if (!line) {
    return null;
  }

  try {
    const object = JSON.parse(line);

    if (!object) {
      return null;
    }

    return {
      date: object.timestamp,
      level: object.level,
      message: object.message,
      raw: line,
    };
  } catch (error) {
    return null;
  }
};
