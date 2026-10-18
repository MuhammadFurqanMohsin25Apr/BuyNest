import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.set('trust proxy', 1); // required behind Render's proxy for rate limiting + secure cookies

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
if (env.NODE_ENV !== 'test') app.use(morgan('dev'));

// NOTE: the Stripe webhook route (later) must be mounted BEFORE this, with express.raw()
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

// modules get mounted here as we build them:
// app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;