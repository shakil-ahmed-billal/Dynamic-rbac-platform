import { Response } from 'express';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import envVars from '../config';
import { CookieUtils } from './cookie';
import { jwtUtils } from './jwt';

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, {
    expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  const isProd = envVars.NODE_ENV !== 'development';
  CookieUtils.setCookie(res, 'accessToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 1000, // 1 day
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  const isProd = envVars.NODE_ENV !== 'development';
  CookieUtils.setCookie(res, 'refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 1000 * 7, // 7 days
  });
};

const clearAuthCookies = (res: Response) => {
  CookieUtils.clearCookie(res, 'accessToken', { path: '/' });
  CookieUtils.clearCookie(res, 'refreshToken', { path: '/' });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
};
