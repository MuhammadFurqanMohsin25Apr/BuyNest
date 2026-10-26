import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { User } from './modules/users/user.model.js';
import { Category } from './modules/categories/category.model.js';
import { Product } from './modules/products/product.model.js';
import { categories, products } from './seedData.js';

if (env.NODE_ENV === 'production') {
  console.error('Refusing to seed in production');
  process.exit(1);
}

const slug = (s) => slugify(s, { lower: true, strict: true });

await connectDB();

await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);
await Promise.all([Product.syncIndexes(), Category.syncIndexes()]);

const cats = await Category.insertMany(categories.map((c) => ({ ...c, slug: slug(c.name) })));
const catId = Object.fromEntries(cats.map((c) => [c.name, c._id]));

await Product.insertMany(
  products.map((p) => {
    const s = slug(p.title);
    return {
      title: p.title,
      slug: s,
      description: p.desc,
      price: p.price * 100,
      compareAtPrice: p.was ? p.was * 100 : undefined,
      // placeholder photos: replace with real product photography later
      images: [1, 2].map((n) => `https://picsum.photos/seed/${s}-${n}/900/1100`),
      category: catId[p.cat],
      variants: p.variants.map((v) => ({ sku: `${s}-${slug(v.label)}`, label: v.label, stock: v.stock })),
      ratingAvg: +(3.8 + Math.random() * 1.1).toFixed(1),
      ratingCount: Math.floor(5 + Math.random() * 60),
    };
  })
);

if (env.SEED_ADMIN_EMAIL && env.SEED_ADMIN_PASSWORD) {
  await User.findOneAndUpdate(
    { email: env.SEED_ADMIN_EMAIL.toLowerCase() },
    {
      $set: {
        name: 'BuyNest Admin',
        role: 'admin',
        passwordHash: await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12),
      },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log('Admin ready:', env.SEED_ADMIN_EMAIL);
}

console.log(`Seeded ${cats.length} categories, ${products.length} products`);
await mongoose.disconnect();