export const getRemainingTime = (timeStamp: string): string => {
  const total = Date.parse(timeStamp) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  let expireIn = '';

  if (days > 0) {
    expireIn += `${days}d`;
  }

  if (hours > 0) {
    expireIn += `${hours}h`;
  }

  if (minutes > 0) {
    expireIn += `${minutes}m`;
  }

  if (seconds > 0) {
    expireIn += `${seconds}s`;
  }

  if (total <= 0 || !total) {
    expireIn = 'Expired';
  }

  return expireIn;
};

export const convertTimestampToDate = (timeStamp: string) => {
  const date: Date = new Date(timeStamp);
  return date.getTime() ? date.toLocaleString() : '';
};

export const parseTimeString = (
  input: string,
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
