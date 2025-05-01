const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  updateAttendance,
  addDocument
} = require('../controllers/studentController');

// Protect all routes
router.use(protect);

// Routes accessible by admin and teachers
router
  .route('/')
  .get(authorize('admin', 'teacher'), getStudents)
  .post(authorize('admin'), createStudent);

router
  .route('/:id')
  .get(authorize('admin', 'teacher', 'student', 'parent'), getStudent)
  .put(authorize('admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

// Attendance routes
router
  .route('/:id/attendance')
  .get(authorize('admin', 'teacher', 'student', 'parent'), getStudentAttendance)
  .post(authorize('admin', 'teacher'), updateAttendance);

// Document routes
router
  .route('/:id/documents')
  .post(authorize('admin'), addDocument);

module.exports = router; 