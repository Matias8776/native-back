import { Router } from 'express';
import {
  addDocuments,
  changeRole,
  deleteInactiveUsers,
  deleteUser,
  getUsers,
  uploaderDocuments
} from '../controllers/users.js';
import { passportAdmin } from '../controllers/sessions.js';

const router = Router();

router.get('/', getUsers);

router.get('/premium/:uid', changeRole);

router.delete('/', passportAdmin, deleteInactiveUsers);

router.delete('/:uid', deleteUser);

router.post('/:uid/documents', uploaderDocuments, addDocuments);

export default router;
