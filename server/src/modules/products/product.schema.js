import { z } from 'zod';

const variantSchema = z.object({
  sku: z.string().trim().min(1).max(60),
  label: z.string().trim().min(1).max(40),
  stock: z.number().int().min(0),
});

const base = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  images: z.array(z.url()).min(1).max(8),
  category: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid category id'),
  variants: z.array(variantSchema).min(1),
  isActive: z.boolean().optional(),
});

const saleOk = (d) => d.compareAtPrice == null || d.price == null || d.compareAtPrice > d.price;
const skusUnique = (d) => !d.variants || new Set(d.variants.map((v) => v.sku)).size === d.variants.length;

const rules = (schema) =>
  schema
    .refine(saleOk, { message: 'compareAtPrice must be higher than price', path: ['compareAtPrice'] })
    .refine(skusUnique, { message: 'SKUs must be unique', path: ['variants'] });

export const createProductSchema = rules(base);
export const updateProductSchema = rules(base.partial());

export const listQuerySchema = z.object({
  search: z.string().trim().max(80).optional(),
  category: z.string().trim().optional(), // category slug
  min: z.coerce.number().int().min(0).optional(),
  max: z.coerce.number().int().min(0).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});