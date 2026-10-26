import { asyncHandler } from '../../utils/asyncHandler.js';
import * as svc from './product.service.js';

export const list = asyncHandler(async (req, res) => {
  const { products, meta } = await svc.listProducts(res.locals.query);
  res.json({ success: true, data: { products }, meta });
});
export const getOne = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.getProductBySlug(req.params.slug) });
});
export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: { product: await svc.createProduct(req.body) } });
});
export const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { product: await svc.updateProduct(req.params.id, req.body) } });
});
export const remove = asyncHandler(async (req, res) => {
  await svc.deactivateProduct(req.params.id);
  res.json({ success: true, data: null });
});