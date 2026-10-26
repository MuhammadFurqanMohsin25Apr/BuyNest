export const validate = (schema, source = 'body') => (req, res, next) => {
  const parsed = schema.parse(req[source]);
  if (source === 'query') res.locals.query = parsed;
  else req[source] = parsed;
  next();
};