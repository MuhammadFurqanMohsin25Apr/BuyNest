import slugify from 'slugify';

export async function uniqueSlug(Model, text) {
  const base = slugify(text, { lower: true, strict: true }) || 'item';
  let slug = base;
  let n = 1;
  while (await Model.exists({ slug })) slug = `${base}-${++n}`;
  return slug;
}