import { parseVeleroLog } from './logs.utils';

describe('parseVeleroLog', () => {
  describe('text (logfmt) format', () => {
    it('parses a default velero log line', () => {
      const line =
        'time="2026-10-16T02:00:38Z" level=info msg="Setting up backup log" backup=velero/daily-20261016020038 controller=backup logSource="pkg/controller/backup_controller.go:663"';

      expect(parseVeleroLog(line)).toEqual({
        date: '2026-10-16T02:00:38Z',
        level: 'info',
        message: 'Setting up backup log',
        raw: line,
        backup: 'daily-20261016020038',
        logSource: 'pkg/controller/backup_controller.go:663',
      });
    });

    it('parses an error log line', () => {
      const line =
        'time="2026-10-16T02:00:40Z" level=error msg="Error getting a backup store" backup-storage-location=velero/default error="rpc error: code = Unknown" logSource="pkg/controller/backup_sync_controller.go:102"';

      expect(parseVeleroLog(line)).toEqual({
        date: '2026-10-16T02:00:40Z',
        level: 'error',
        message: 'Error getting a backup store',
        raw: line,
        backupStorageLocation: 'default',
        error: 'rpc error: code = Unknown',
        // existing behaviour: the `expiration` getter reuses the error regex
        expiration: 'rpc error: code = Unknown',
        logSource: 'pkg/controller/backup_sync_controller.go:102',
      });
    });

    it('returns null for an unrecognised line', () => {
      expect(parseVeleroLog('')).toBeNull();
      expect(parseVeleroLog('not a velero log line')).toBeNull();
    });
  });

  describe('json format', () => {
    it('parses an info log line', () => {
      const line =
        '{"backup":"velero/daily-20261016020038","level":"info","logSource":"pkg/backup/backup.go:465","msg":"Processing item","name":"web-0","namespace":"default","resource":"pods","time":"2026-10-16T02:00:38Z"}';

      expect(parseVeleroLog(line)).toEqual({
        date: '2026-10-16T02:00:38Z',
        level: 'info',
        message: 'Processing item',
        raw: line,
        backup: 'daily-20261016020038',
        logSource: 'pkg/backup/backup.go:465',
        name: 'web-0',
        namespace: 'default',
        resource: 'pods',
      });
    });

    it('parses a warning log line with an error', () => {
      const line =
        '{"backup":"velero/daily-20261016020038","error.file":"/go/src/github.com/vmware-tanzu/velero/pkg/backup/item_backupper.go:180","error.function":"github.com/vmware-tanzu/velero/pkg/backup.(*itemBackupper).backupItemInternal","error.message":"pods \\"web-0\\" not found","group":"v1","level":"warning","logSource":"pkg/backup/backup.go:470","msg":"Error backing up item","name":"web-0","time":"2026-10-16T02:00:39Z"}';

      expect(parseVeleroLog(line)).toEqual({
        date: '2026-10-16T02:00:39Z',
        level: 'warning',
        message: 'Error backing up item',
        raw: line,
        backup: 'daily-20261016020038',
        error: 'pods "web-0" not found',
        group: 'v1',
        logSource: 'pkg/backup/backup.go:470',
        name: 'web-0',
      });
    });

    it('parses a plugin log line', () => {
      const line =
        '{"backup-storage-location":"velero/default","cmd":"/plugins/velero-plugin-for-aws","level":"info","logSource":"/go/src/velero-plugin-for-aws/velero-plugin-for-aws/object_store.go:123","msg":"Uploading object","plugin":"/plugins/velero-plugin-for-aws","pluginName":"velero-plugin-for-aws","time":"2026-10-16T02:00:41Z"}';

      expect(parseVeleroLog(line)).toEqual({
        date: '2026-10-16T02:00:41Z',
        level: 'info',
        message: 'Uploading object',
        raw: line,
        backupStorageLocation: 'default',
        logSource:
          '/go/src/velero-plugin-for-aws/velero-plugin-for-aws/object_store.go:123',
        plugin: 'velero-plugin-for-aws',
      });
    });

    it('ignores non-string field values', () => {
      const line =
        '{"level":"info","msg":"Backup completed","name":42,"namespace":null,"time":"2026-10-16T02:05:00Z"}';

      expect(parseVeleroLog(line)).toEqual({
        date: '2026-10-16T02:05:00Z',
        level: 'info',
        message: 'Backup completed',
        raw: line,
      });
    });

    it('returns null for malformed json', () => {
      expect(
        parseVeleroLog('{"level":"info","msg":"truncated line"')
      ).toBeNull();
    });

    it('returns null for json without level or msg', () => {
      expect(parseVeleroLog('{"time":"2026-10-16T02:00:38Z"}')).toBeNull();
      expect(parseVeleroLog('{"level":"info"}')).toBeNull();
      expect(parseVeleroLog('[]')).toBeNull();
    });

    it('falls back to the text format when the json is not a velero log', () => {
      const line =
        '{not json} time="2026-10-16T02:00:38Z" level=info msg="Fallback"';

      expect(parseVeleroLog(line)).toEqual({
        date: '2026-10-16T02:00:38Z',
        level: 'info',
        message: 'Fallback',
        raw: line,
      });
    });
  });
});
