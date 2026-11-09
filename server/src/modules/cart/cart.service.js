import { Cart } from './cart.model.js';
import { Product } from '../products/product.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { calcTotals } from '../../utils/pricing.js';

const MAX_QTY = 10;

async function getOrCreateCart(userId) {
  try {
    return await Cart.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { items: [] } },
      { upsert: true, new: true }
    );
  } catch (e) {
    // two requests created it at the same moment: the unique index rejected one, so just read it
    if (e.code === 11000) return Cart.findOne({ user: userId });
    throw e;
  }
}

async function findVariant(productId, sku) {
  const product = await Product.findOne({ _id: productId, isActive: true }).select('variants');
  return product?.variants.find((v) => v.sku === sku) ?? null;
}

function addToCart(cart, productId, sku, qty, stock) {
  const existing = cart.items.find((i) => i.product.toString() === String(productId) && i.sku === sku);
  const finalQty = Math.min((existing?.qty ?? 0) + qty, MAX_QTY, stock);
  if (existing) existing.qty = finalQty;
  else cart.items.push({ product: productId, sku, qty: finalQty });
}

// Turns a cart into what the frontend shows. Prices come from the DB, never from the client.
export async function buildCartView(cart) {
  const ids = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids }, isActive: true })
    .select('title slug price compareAtPrice images variants');
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  const lines = [];
  const dead = [];
  for (const item of cart.items) {
    const p = byId.get(item.product.toString());
    const v = p?.variants.find((x) => x.sku === item.sku);
    if (!p || !v) { dead.push(item); continue; }
    lines.push({
      productId: p._id,
      slug: p.slug,
      title: p.title,
      image: p.images[0],
      sku: v.sku,
      variantLabel: v.label,
      unitPrice: p.price,
      compareAtPrice: p.compareAtPrice,
      qty: item.qty,
      stock: v.stock,
      lineTotal: p.price * item.qty,
      problem: v.stock === 0 ? 'out_of_stock' : item.qty > v.stock ? 'low_stock' : null,
    });
  }

  // products that were deleted or deactivated are removed from the cart for good
  if (dead.length) {
    cart.items = cart.items.filter((i) => !dead.includes(i));
    await cart.save();
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  return {
    items: lines,
    itemCount: lines.reduce((n, l) => n + l.qty, 0),
    removedCount: dead.length,
    ...calcTotals(subtotal),
  };
}

export async function getCartView(userId) {
  return buildCartView(await getOrCreateCart(userId));
}

export async function addItem(userId, { productId, sku, qty }) {
  const variant = await findVariant(productId, sku);
  if (!variant) throw new ApiError(404, 'Product variant not found');
  if (variant.stock === 0) throw new ApiError(409, 'This item is out of stock');

  const cart = await getOrCreateCart(userId);
  addToCart(cart, productId, sku, qty, variant.stock);
  await cart.save();
  return buildCartView(cart);
}

export async function setQty(userId, { productId, sku, qty }) {
  const variant = await findVariant(productId, sku);
  if (!variant) throw new ApiError(404, 'Product variant not found');

  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.product.toString() === productId && i.sku === sku);
  if (!item) throw new ApiError(404, 'Item is not in your cart');
  item.qty = Math.min(qty, MAX_QTY, Math.max(variant.stock, 1));
  await cart.save();
  return buildCartView(cart);
}

export async function removeItem(userId, productId, sku) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => !(i.product.toString() === productId && i.sku === sku));
  await cart.save();
  return buildCartView(cart);
}

export async function clearCart(userId) {
  await Cart.updateOne({ user: userId }, { $set: { items: [] } });
  return buildCartView(await getOrCreateCart(userId));
}

// Called once after login with the guest cart from localStorage
export async function mergeGuestItems(userId, items) {
  const cart = await getOrCreateCart(userId);
  for (const { productId, sku, qty } of items) {
    const variant = await findVariant(productId, sku).catch(() => null); // bad ids are skipped
    if (!variant || variant.stock === 0) continue;                       // skipped silently
    addToCart(cart, productId, sku, qty, variant.stock);
  }
  await cart.save();
  return buildCartView(cart);
}