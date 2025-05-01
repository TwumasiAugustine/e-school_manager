const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudent,
  removeStudent,
  addAnnouncement
} = require('../controllers/classController');

// Protect all routes
router.use(protect);

// Class CRUD routes
router
  .route('/')
  .get(authorize('admin', 'teacher'), getClasses)
  .post(authorize('admin'), createClass);

router
  .route('/:id')
  .get(authorize('admin', 'teacher', 'student', 'parent'), getClass)
  .put(authorize('admin'), updateClass)
  .delete(authorize('admin'), deleteClass);

// Student management routes
router
  .route('/:id/students')
  .post(authorize('admin'), addStudent);

router
  .route('/:id/students/:studentId')
  .delete(authorize('admin'), removeStudent);

// Announcement routes
router
  .route('/:id/announcements')
  .post(authorize('admin', 'teacher'), addAnnouncement);

module.exports = router; 