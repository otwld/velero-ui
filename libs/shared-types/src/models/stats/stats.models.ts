import type { V1BackupPhase, V1RestorePhase } from '@velero-ui/velero';

export interface BasicStats {
  totalBackups: number;
  totalSchedules: number;
  totalRestores: number;
  totalStorageLocations: number;
}

export interface BackupsStatusStats {
  labels: V1BackupPhase[];
  series: number[];
  colors: string[];
}

export interface BackupsSuccessRateStats {
  series: number[];
}

export interface RestoresStatusStats {
  labels: V1RestorePhase[];
  series: number[];
  colors: string[];
}

export interface RestoresSuccessRateStats {
  series: number[];
}

export interface BackupsNextScheduled {
  name: string;
  schedule: string;
  nextRun: string;
}

export interface BackupsLasted {
  name: string;
  date: string;
}

export interface ScheduleStats {
  duration: ScheduleSeriesStats;
  size: ScheduleSeriesStats;
  items: ScheduleSeriesStats;
}

export interface ScheduleSeriesStats {
  series: ScheduleSeriesDataStats[];
}

export interface ScheduleSeriesDataStats {
  name: string;
  data: ScheduleDataStats[];
}

export interface ScheduleDataStats {
  x: string;
  y: number;
}

