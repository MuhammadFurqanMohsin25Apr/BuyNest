import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFound = (req, res, next) => 
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

export function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message || 'Server Error';
    let errors = err.errors || null;

    if (err instanceof ZodError) {
        status = 400;
        message = 'Validation Failed';
        errors = ZodError.flatten(err).fieldErrors;
    } else if (err.name === 'ValidationError') {
        status = 400;
        errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    } else if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID';
    } else if (err.code === 11000) {
        status = 409;
        message = `{Object.keys(err.keyValue)[0]} already exists`;
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Invalid or expired token';
    }

    if (status === 500) console.error(err);
    res.status(status).json({
        success: false,
        message: status === 500 && env.NODE_ENV === 'production' ? 'Server Error' : message,
        errors,
    });
}