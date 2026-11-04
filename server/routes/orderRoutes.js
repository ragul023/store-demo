import { Router } from 'express';
import { createOrder, listAllOrders, listMyOrders } from '../controllers/orderController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
const router=Router();
router.use(requireAuth);
router.post('/',createOrder);
router.get('/mine',listMyOrders);
router.get('/',requireAdmin,listAllOrders);
export default router;
