import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const DAYS = 7;
export const COOKIE_NAME = 'token';

export const signToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: `${DAYS}d` });

const isProd = env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,                         // JS cannot read it (XSS protection)
  secure: isProd,                         // HTTPS only in production
  sameSite: isProd ? 'none' : 'lax',      // 'none' needed: Vercel and Render are different sites
  maxAge: DAYS * 24 * 60 * 60 * 1000,
  path: '/',
};