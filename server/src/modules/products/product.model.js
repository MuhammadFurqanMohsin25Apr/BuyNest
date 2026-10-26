import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true }, // "Oat", "15-inch", "Default"
    stock: { type: Number, required: true, min: 0, default: 0, validate: Number.isInteger },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 1, validate: Number.isInteger },
    compareAtPrice: { type: Number, min: 1, validate: Number.isInteger },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    images: {
  type: [String],
  validate: {
    validator: (v) => Array.isArray(v) && v.length > 0,
    message: 'At least one product image is required',
  },
},

variants: {
  type: [variantSchema],
  validate: {
    validator: (v) => Array.isArray(v) && v.length > 0,
    message: 'At least one product variant is required',
  },
},
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_d, ret) => { delete ret.__v; return ret; },
    },
  }
);


productSchema.virtual('inStock').get(function () {
  return (this.variants ?? []).some((v) => v.stock > 0);
});


productSchema.index({ title: 'text', description: 'text' }, { weights: { title: 5, description: 1 } });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isActive: 1, createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);