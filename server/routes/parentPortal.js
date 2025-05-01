const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getParentPortal,
  addStudent,
  sendCommunication,
  addFeePayment,
  addAttendance,
  addProgressReport,
  markCommunicationAsRead,
  getFeePaymentHistory,
  getAttendanceHistory,
  getProgressReports
} = require('../controllers/parentPortalController');

// Protect all routes
router.use(protect);

// Get parent portal - accessible by parent
router.get('/', authorize('parent'), getParentPortal);

// Add student to portal - accessible by parent
router.post('/students', authorize('parent'), addStudent);

// Send communication - accessible by teachers and admin
router.post('/communications', authorize('teacher', 'admin'), sendCommunication);

// Mark communication as read - accessible by parent
router.put('/communications/:communicationId/read', authorize('parent'), markCommunicationAsRead);

// Add fee payment - accessible by parent
router.post('/fee-payments', authorize('parent'), addFeePayment);

// Get fee payment history - accessible by parent
router.get('/fee-payments', authorize('parent'), getFeePaymentHistory);

// Add attendance record - accessible by teachers and admin
router.post('/attendance', authorize('teacher', 'admin'), addAttendance);

// Get attendance history - accessible by parent
router.get('/attendance', authorize('parent'), getAttendanceHistory);

// Add progress report - accessible by teachers and admin
router.post('/progress-reports', authorize('teacher', 'admin'), addProgressReport);

// Get progress reports - accessible by parent
router.get('/progress-reports', authorize('parent'), getProgressReports);

module.exports = router; 