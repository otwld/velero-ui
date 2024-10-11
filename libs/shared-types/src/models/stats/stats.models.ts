export interface BasicStats {
  totalBackups: number;
  totalSchedules: number;
  totalRestores: number;
  totalStorageLocations: number;
}

export interface BackupsStatusStats {
  labels: string[];
  series: number[];
}

export interface BackupsSuccessRateStats {
  series: number[];
}

export interface RestoresStatusStats {
  labels: string[];
  series: number[];
}

export interface RestoresSuccessRateStats {
  series: number[];
}
