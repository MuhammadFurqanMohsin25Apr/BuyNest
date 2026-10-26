import { Category } from './category.model.js';
import { Product } from '../products/product.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { uniqueSlug } from '../../utils/slug.js';

export const listCategories = () => Category.find().sort({ name: 1 });

export async function createCategory({ name, image }) {
  const slug = await uniqueSlug(Category, name);
  return Category.create({ name, slug, image });
}

export async function updateCategory(id, data) {
  const cat = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!cat) throw new ApiError(404, 'Category not found');
  return cat; // slug stays stable on purpose
}

export async function deleteCategory(id) {
  if (await Product.exists({ category: id })) {
    throw new ApiError(409, 'Category still has products. Move or remove them first.');
  }
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) throw new ApiError(404, 'Category not found');
}