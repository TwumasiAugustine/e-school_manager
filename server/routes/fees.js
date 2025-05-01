const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
  addPayment,
  getStudentFees,
  generateReceipt
} = require('../controllers/feeController');

// Protect all routes
router.use(protect);

// Routes accessible by admin
router
  .route('/')
  .get(authorize('admin'), getFees)
  .post(authorize('admin'), createFee);

router
  .route('/:id')
  .get(authorize('admin', 'student', 'parent'), getFee)
  .put(authorize('admin'), updateFee)
  .delete(authorize('admin'), deleteFee);

// Payment routes
router
  .route('/:id/payments')
  .post(authorize('admin'), addPayment);

// Student fees route
router
  .route('/student/:studentId')
  .get(authorize('admin', 'student', 'parent'), getStudentFees);

// Receipt generation route
router
  .route('/:id/receipt')
  .get(authorize('admin', 'student', 'parent'), generateReceipt);

module.exports = router; 