import { Router } from 'express';
import { createAddress, listAddresses } from '../controllers/addressController.js';
import { requireAuth } from '../middleware/auth.js';
const router=Router();
router.use(requireAuth);
router.get('/',listAddresses);
router.post('/',createAddress);
export default router;
