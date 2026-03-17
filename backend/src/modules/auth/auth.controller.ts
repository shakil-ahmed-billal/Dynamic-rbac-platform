import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { CookieUtils } from '../../utils/cookie';
import { tokenUtils } from '../../utils/token';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'User registered successfully.',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Login successful.',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user!);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User profile retrieved successfully.',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = CookieUtils.getCookie(req, 'refreshToken') || req.body.refreshToken;

  const result = await AuthService.refreshToken(token);

  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Token refreshed successfully.',
    data: { accessToken: result.accessToken },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.changePassword(req.user!, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Password changed successfully.',
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  tokenUtils.clearAuthCookies(res);
  const result = await AuthService.logout();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  getMe,
  refreshToken,
  changePassword,
  logout,
};
