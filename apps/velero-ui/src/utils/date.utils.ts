import {
  getDefaultLocal,
  getDefaultTimezone,
} from '@velero-ui-app/utils/config.utils';
import { i18n } from '@velero-ui-app/plugins/i18n.plugin';

export const getRemainingTime = (timeStamp: string): string => {
  const total = Date.parse(timeStamp) - Date.parse(new Date().toISOString());

  return getTime(total) || i18n.global.t('global.date.expired');
};

export const getSinceTime = (timeStamp: string): string => {
  const total = Date.parse(new Date().toISOString()) - Date.parse(timeStamp);

  return getTime(total) || i18n.global.t('global.date.now');
};

export const getTime = (time: number): string | null => {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / 1000 / 60) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const days = Math.floor(time / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return i18n.global.t('global.date.day', { count: days });
  }

  if (hours > 0) {
    return i18n.global.t('global.date.hour', { count: hours });
  }

  if (minutes > 0) {
    return i18n.global.t('global.date.minute', { count: minutes });
  }

  if (seconds > 0) {
    return i18n.global.t('global.date.second', { count: seconds });
  }

  return null;
};

export const convertTimestampToDate = (timeStamp: string) => {
  const date: Date = new Date(timeStamp);
  return date.getTime()
    ? date.toLocaleString(getDefaultLocal(), { timeZone: getDefaultTimezone() })
    : '';
};

export const parseTimeString = (
  input: string
): {
  value: number;
  unit: string;
} | null => {
  if (!input) {
    return null;
  }

  const match: RegExpMatchArray = input.match(/^(\d+)([a-zA-Z]+)/);

  if (!match) {
    return null;
  }

  const [, value, unit] = match;
  return {
    value: parseInt(value, 10),
    unit,
  };
};

export const durationToLabel = (duration: number): string => {
  const mins: number = Math.floor(duration / 60);
  const secs: number = duration % 60;
  let label = '';

  if (mins) {
    label += `${mins}m`;
  }

  if (secs) {
    label += `${secs}s`;
  }
  return label;
};

/*
  ex: CRON_TZ=America/New_York 0 3 * * *
 */
export const parseVeleroCron = (
  expr: string
): { timezone: string; cron: string } => {
  let timezone: string | null = null;
  let cron: string;

  const tzMatch = expr.match(/^CRON_TZ=([^\s]+)\s+(.*)$/);
  if (tzMatch) {
    timezone = tzMatch[1];
    cron = tzMatch[2];
  } else {
    cron = expr;
  }

  return { timezone, cron };
};
