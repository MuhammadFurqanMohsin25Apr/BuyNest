export const validate = (schema) => (req, res, next) => {
  req.body = schema.parse(req.body); // throws ZodError -> our error handler returns 400
  next();
};