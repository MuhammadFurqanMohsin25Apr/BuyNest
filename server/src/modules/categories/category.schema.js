import { z } from 'zod';

export const categoryBodySchema = z.object({
  name: z.string().trim().min(2).max(40),
  image: z.url().optional(),
});
export const categoryUpdateSchema = categoryBodySchema.partial();