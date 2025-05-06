export const truncate = (str: string, end = 43): string =>
  str.length > end ? str.slice(0, end - 3) + '...' : str;

export const convertBytes = (bytes: number): string => {
  if (!bytes) return '0B';

  const units: string[] = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;

  while (bytes >= 1000 && unitIndex < units.length - 1) {
    bytes /= 1000;
    unitIndex++;
  }

  return `${Math.round(bytes)}${units[unitIndex]}`;
};
