import { Router } from 'express';
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  uploaderProduct
} from '../controllers/products.js';
import { passportPremium } from '../controllers/sessions.js';

const router = Router();

router.get('/', getProducts);

router.get('/:pid', getProductById);

router.post('/', passportPremium, uploaderProduct, addProduct);

router.put('/:pid', passportPremium, updateProduct);

router.delete('/:pid', passportPremium, deleteProduct);

export default router;
