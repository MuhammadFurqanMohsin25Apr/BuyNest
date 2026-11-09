import { asyncHandler } from '../../utils/asyncHandler.js';
import * as svc from './cart.service.js';

const send = (res, cart) => res.json({ success: true, data: { cart } });

export const get = asyncHandler(async (req, res) => send(res, await svc.getCartView(req.user._id)));
export const add = asyncHandler(async (req, res) => send(res, await svc.addItem(req.user._id, req.body)));
export const setQty = asyncHandler(async (req, res) => send(res, await svc.setQty(req.user._id, req.body)));
export const remove = asyncHandler(async (req, res) =>
  send(res, await svc.removeItem(req.user._id, req.params.productId, req.params.sku)));
export const clear = asyncHandler(async (req, res) => send(res, await svc.clearCart(req.user._id)));
export const merge = asyncHandler(async (req, res) =>
  send(res, await svc.mergeGuestItems(req.user._id, req.body.items)));