const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getSchedule,
  updateSchedule,
  addEvaluation,
  addProfessionalDevelopment
} = require('../controllers/teacherController');

// Protect all routes
router.use(protect);

// Routes accessible by admin
router
  .route('/')
  .get(authorize('admin'), getTeachers)
  .post(authorize('admin'), createTeacher);

router
  .route('/:id')
  .get(authorize('admin', 'teacher'), getTeacher)
  .put(authorize('admin'), updateTeacher)
  .delete(authorize('admin'), deleteTeacher);

// Schedule routes
router
  .route('/:id/schedule')
  .get(authorize('admin', 'teacher'), getSchedule)
  .put(authorize('admin'), updateSchedule);

// Performance evaluation routes
router
  .route('/:id/evaluations')
  .post(authorize('admin'), addEvaluation);

// Professional development routes
router
  .route('/:id/professional-development')
  .post(authorize('admin', 'teacher'), addProfessionalDevelopment);

module.exports = router; 