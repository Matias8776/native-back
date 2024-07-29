import { Router } from 'express';
import {
  adminPanel,
  cart,
  chat,
  login,
  notFound,
  privateAccess,
  product,
  products,
  publicAccess,
  realtimeproducts,
  register,
  resetPassword,
  sendResetEmail,
  verifyToken
} from '../controllers/views.js';
import { passportAdmin, passportUser } from '../controllers/sessions.js';

const router = Router();

router.get('/', publicAccess, login);

router.get('/register', publicAccess, register);

router.get('/realtimeproducts', passportAdmin, realtimeproducts);

router.get('/chat', privateAccess, passportUser, chat);

router.get('/products', privateAccess, products);

router.get('/sendresetemail', publicAccess, sendResetEmail);

router.get('/products/:pid', privateAccess, passportUser, product);

router.get('/carts/:cid', privateAccess, cart);

router.get('/resetpassword/:email', publicAccess, verifyToken, resetPassword);

router.get('/adminPanel', privateAccess, passportAdmin, adminPanel);

router.use(notFound);

export default router;
