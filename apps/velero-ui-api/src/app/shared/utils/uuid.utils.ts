import { v4 as uuidv4 } from 'uuid';

export const generateUuidName = (name: string): string => `${name}-${uuidv4()}`;

export const generateDateName = (name: string): string => {
  const d: Date = new Date();
  return `${name}-${d.getFullYear()}${('0' + d.getMonth() + 1).slice(-2)}${('0' + d.getDay()).slice(-2)}${('0' + d.getHours()).slice(-2)}${('0' + d.getMinutes()).slice(-2)}${d.getSeconds()}`;
};
