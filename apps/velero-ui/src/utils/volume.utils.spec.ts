import { describe, expect, it } from 'vitest';
import {
  belongsToParent,
  progressPercent,
  type VolumeOperation,
} from './volume.utils';

const volume = (labels: Record<string, string>, ownerReferences?: object[]) =>
  ({ metadata: { labels, ownerReferences } }) as VolumeOperation;

describe('volume attribution', () => {
  it('uses exact backup labels instead of generated-name prefixes', () => {
    expect(
      belongsToParent(
        volume({ 'velero.io/backup-name': 'daily-other' }),
        'daily',
        true
      )
    ).toBe(false);
    expect(
      belongsToParent(
        volume({ 'velero.io/backup-name': 'daily' }),
        'daily',
        true
      )
    ).toBe(true);
  });
  it('separates downloads by restore rather than original backup', () => {
    const item = volume({
      'velero.io/backup-name': 'daily',
      'velero.io/restore-name': 'restore-a',
    });
    expect(belongsToParent(item, 'daily', false)).toBe(false);
    expect(belongsToParent(item, 'restore-a', false)).toBe(true);
  });
  it('excludes resources from an earlier backup with the same name', () => {
    expect(
      belongsToParent(
        volume({
          'velero.io/backup-name': 'daily',
          'velero.io/backup-uid': 'old',
        }),
        'daily',
        true,
        'new'
      )
    ).toBe(false);
  });
  it('handles hashed labels on long backup names through UID or ownership', () => {
    const name = 'backup-'.repeat(12);
    expect(
      belongsToParent(
        volume({
          'velero.io/backup-name': 'hashed',
          'velero.io/backup-uid': 'uid',
        }),
        name,
        true,
        'uid'
      )
    ).toBe(true);
    expect(
      belongsToParent(
        volume({ 'velero.io/backup-name': 'hashed' }, [
          { name, kind: 'Backup', uid: 'uid' },
        ]),
        name,
        true
      )
    ).toBe(true);
  });
  it('supports older filesystem backup tags', () => {
    const item = { spec: { tags: { backup: 'daily' } } } as VolumeOperation;
    expect(belongsToParent(item, 'daily', true)).toBe(true);
    expect(belongsToParent(item, 'daily', false)).toBe(false);
  });
});

describe('volume progress', () => {
  it('handles pending and empty volumes without NaN or Infinity', () => {
    expect(progressPercent()).toBe(0);
    expect(progressPercent({ bytesDone: 5, totalBytes: 0 })).toBe(0);
    expect(progressPercent({ totalBytes: 100 })).toBe(0);
  });
  it('clamps stale or invalid totals and shows normal progress', () => {
    expect(progressPercent({ bytesDone: 150, totalBytes: 100 })).toBe(100);
    expect(progressPercent({ bytesDone: -5, totalBytes: 100 })).toBe(0);
    expect(progressPercent({ bytesDone: 25, totalBytes: 100 })).toBe(25);
  });
});
