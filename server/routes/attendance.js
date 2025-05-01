const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getClassAttendance,
  markAttendance,
  getStudentAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');

// Protect all routes
router.use(protect);

// Class attendance routes
router
  .route('/class')
  .get(authorize('admin', 'teacher'), getClassAttendance)
  .post(authorize('admin', 'teacher'), markAttendance);

// Student attendance route
router
  .route('/student/:studentId')
  .get(authorize('admin', 'teacher', 'student', 'parent'), getStudentAttendance);

// Attendance statistics route
router
  .route('/stats')
  .get(authorize('admin', 'teacher'), getAttendanceStats);

module.exports = router; 