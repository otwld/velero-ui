import { jwtDecode } from 'jwt-decode';

export const hasExpired = (token: string): boolean =>
  token ? Date.now() >= jwtDecode(token).exp * 1000 : false;

export const getUser = (token: string) =>
  token ? jwtDecode(token) : null;
