import { asyncHandler } from '../../utils/asyncHandler.js';
import { signToken, cookieOptions, COOKIE_NAME } from '../../utils/token.js';
import { registerUser, loginUser } from './auth.service.js';

const sendAuth = (res, status, user) => {
  res.cookie(COOKIE_NAME, signToken(user._id), cookieOptions);
  res.status(status).json({ success: true, data: { user } });
};

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  sendAuth(res, 201, user);
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  sendAuth(res, 200, user);
});

export const logout = (req, res) => {
  const { maxAge, ...opts } = cookieOptions; // clearCookie needs same options (minus maxAge)
  res.clearCookie(COOKIE_NAME, opts);
  res.json({ success: true, data: null });
};

export const me = (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};