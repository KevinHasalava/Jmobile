const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// Public: submit a new inquiry
router.post('/', submitInquiry);

// Admin only: manage inquiries
router.get('/', protect, admin, getAllInquiries);
router.put('/:id', protect, admin, updateInquiryStatus);
router.delete('/:id', protect, admin, deleteInquiry);

module.exports = router;
