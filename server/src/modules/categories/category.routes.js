import { Router } from 'express';
import { protect, restrictTo } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { categoryBodySchema, categoryUpdateSchema } from './category.schema.js';
import { list, create, update, remove } from './category.controller.js';

const router = Router();
router.get('/', list);
router.post('/', protect, restrictTo('admin'), validate(categoryBodySchema), create);
router.patch('/:id', protect, restrictTo('admin'), validate(categoryUpdateSchema), update);
router.delete('/:id', protect, restrictTo('admin'), remove);
export default router;