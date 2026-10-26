import { Product } from './product.model.js';
import { Category } from '../categories/category.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { uniqueSlug } from '../../utils/slug.js';

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { ratingAvg: -1, ratingCount: -1 },
};

export async function listProducts(q) {
  const filter = { isActive: true };
  const meta = (total) => ({ page: q.page, limit: q.limit, total, pages: Math.ceil(total / q.limit) });

  if (q.category) {
    const cat = await Category.findOne({ slug: q.category }).select('_id');
    if (!cat) return { products: [], meta: meta(0) };
    filter.category = cat._id;
  }
  if (q.min != null || q.max != null) {
    filter.price = {};
    if (q.min != null) filter.price.$gte = q.min;
    if (q.max != null) filter.price.$lte = q.max;
  }
  if (q.search) filter.$text = { $search: q.search };

  // with a search term and the default sort, rank by relevance instead
  const byRelevance = q.search && q.sort === 'newest';
  const sort = byRelevance ? { score: { $meta: 'textScore' } } : SORTS[q.sort];
  const projection = byRelevance ? { score: { $meta: 'textScore' } } : {};

  const [products, total] = await Promise.all([
    Product.find(filter, projection)
      .sort(sort)
      .skip((q.page - 1) * q.limit)
      .limit(q.limit)
      .populate('category', 'name slug'),
    Product.countDocuments(filter),
  ]);
  return { products, meta: meta(total) };
}

export async function getProductBySlug(slug) {
  const product = await Product.findOne({ slug, isActive: true }).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found');

  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .select('title slug price compareAtPrice images');
  return { product, related };
}

async function assertCategory(id) {
  if (!(await Category.exists({ _id: id }))) throw new ApiError(400, 'Category does not exist');
}

export async function createProduct(data) {
  await assertCategory(data.category);
  const slug = await uniqueSlug(Product, data.title);
  return Product.create({ ...data, slug });
}

export async function updateProduct(id, data) {
  if (data.category) await assertCategory(data.category);
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, 'Product not found');
  return product; // slug is not regenerated, so existing links keep working
}

export async function deactivateProduct(id) {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw new ApiError(404, 'Product not found');
}