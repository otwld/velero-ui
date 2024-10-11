import { v4 as uuidv4 } from 'uuid';

export const truncate = (str: string, end = 43): string =>
  str.length > end ? str.slice(0, end - 3) + '...' : str;


export const generateState = (name: string): string => `${uuidv4()}`;

