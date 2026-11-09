import { Router } from 'express';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { addItemSchema, setQtySchema, mergeSchema } from './cart.schema.js';
import { get, add, setQty, remove, clear, merge } from './cart.controller.js';

const router = Router();
router.use(protect); // every cart route needs a logged-in user

router.get('/', get);
router.post('/items', validate(addItemSchema), add);
router.patch('/items', validate(setQtySchema), setQty);
router.delete('/items/:productId/:sku', remove);
router.delete('/', clear);
router.post('/merge', validate(mergeSchema), merge);

export default router;