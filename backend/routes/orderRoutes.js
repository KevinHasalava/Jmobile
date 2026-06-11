const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  cancelOrder,
  verifyBankSlip,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// IMPORTANT: '/myorders' must come BEFORE '/:id' to avoid Express
// treating 'myorders' as an ID parameter
router.get('/myorders', protect, getMyOrders);

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, cancelOrder);

router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/verify-slip', protect, admin, verifyBankSlip);

module.exports = router;
