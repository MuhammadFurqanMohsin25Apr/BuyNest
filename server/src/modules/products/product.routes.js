import { Router } from 'express';
import { protect, restrictTo } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createProductSchema, updateProductSchema, listQuerySchema } from './product.schema.js';
import { list, getOne, create, update, remove } from './product.controller.js';

const router = Router();
router.get('/', validate(listQuerySchema, 'query'), list);
router.get('/:slug', getOne);
router.post('/', protect, restrictTo('admin'), validate(createProductSchema), create);
router.patch('/:id', protect, restrictTo('admin'), validate(updateProductSchema), update);
router.delete('/:id', protect, restrictTo('admin'), remove);
export default router;