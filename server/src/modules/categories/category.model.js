import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 40 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
  },
  { timestamps: true }
);

categorySchema.set('toJSON', {
  transform: (_d, ret) => { delete ret.__v; return ret; },
});

export const Category = mongoose.model('Category', categorySchema);