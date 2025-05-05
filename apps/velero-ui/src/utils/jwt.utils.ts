import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@velero-ui/shared-types';

export const hasExpired = (token: string): boolean =>
  token ? Date.now() >= jwtDecode(token).exp * 1000 : false;

export const getUser = (token: string): JwtPayload =>
  token ? jwtDecode(token) : null;

