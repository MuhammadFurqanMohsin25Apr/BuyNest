import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),
    MONGO_URI: z.string().min(1),
    JWT_SECRET: z.string().min(16),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CLIENT_URL: z.url(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment:', z.flattenError(parsed.error).fieldErrors);
    process.exit(1);
}

export const env = parsed.data;