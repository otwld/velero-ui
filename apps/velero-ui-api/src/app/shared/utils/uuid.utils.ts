import { v4 as uuidv4 } from 'uuid';

export const generateUuidName = (name: string): string =>
  `${name}-${uuidv4()}`;
