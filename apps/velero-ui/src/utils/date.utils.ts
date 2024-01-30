export const getRemainingTime = (timeStamp: string): string => {
  const startDate = new Date();
  const endDate = new Date(timeStamp);

  const difference = endDate.getTime() - startDate.getTime();
  let expireIn = '';

  if (Math.floor(difference / (1000 * 3600 * 24)) > 0) {
    expireIn += `${Math.floor(difference / (1000 * 3600 * 24))}d`;
  }

  if (Math.ceil(difference / (1000 * 3600)) > 0) {
    expireIn += `${Math.ceil(difference / (1000 * 3600))}h`;
  }

  if (difference <= 0) {
    expireIn = 'Expired';
  }

  return expireIn;
};

export const convertTimestampToDate = (timeStamp: string) => {
  return new Date(timeStamp).toLocaleDateString();
};
