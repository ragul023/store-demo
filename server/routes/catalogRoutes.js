import { Router } from 'express';
import { listCategories, listCollections } from '../controllers/catalogController.js';
const router=Router();
router.get('/categories',listCategories);
router.get('/collections',listCollections);
export default router;
