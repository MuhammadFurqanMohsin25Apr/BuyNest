import { asyncHandler } from '../../utils/asyncHandler.js';
import * as svc from './category.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { categories: await svc.listCategories() } });
});
export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: { category: await svc.createCategory(req.body) } });
});
export const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { category: await svc.updateCategory(req.params.id, req.body) } });
});
export const remove = asyncHandler(async (req, res) => {
  await svc.deleteCategory(req.params.id);
  res.json({ success: true, data: null });
});