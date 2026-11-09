import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const sku = z.string().trim().min(1).max(60);

export const addItemSchema = z.object({
  productId: objectId,
  sku,
  qty: z.number().int().min(1).max(10).default(1),
});

export const setQtySchema = z.object({
  productId: objectId,
  sku,
  qty: z.number().int().min(1).max(10),
});

export const mergeSchema = z.object({
  items: z.array(addItemSchema).max(30),
});