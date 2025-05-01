const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentGrades,
  getClassGrades,
  updateWeights,
  addClassScore,
  addExamScore,
  updateScore,
  deleteScore,
  getGradeStats,
  generateReportCard
} = require('../controllers/gradeController');

// Protect all routes
router.use(protect);

// Get student grades - accessible by student, parent, teacher, and admin
router.get('/student/:studentId', getStudentGrades);

// Get class grades - accessible by teacher and admin
router.get('/class', authorize('teacher', 'admin'), getClassGrades);

// Get grade statistics - accessible by teacher and admin
router.get('/stats', authorize('teacher', 'admin'), getGradeStats);

// Generate report card - accessible by student, parent, teacher, and admin
router.get('/report-card/:studentId/:term/:academicYear', generateReportCard);

// Update grade weights - accessible by teacher and admin
router.put('/:id/weights', authorize('teacher', 'admin'), updateWeights);

// Add class score - accessible by teacher and admin
router.post('/class-score', authorize('teacher', 'admin'), addClassScore);

// Add exam score - accessible by teacher and admin
router.post('/exam-score', authorize('teacher', 'admin'), addExamScore);

// Update score - accessible by teacher and admin
router.put('/:id/score/:scoreId', authorize('teacher', 'admin'), updateScore);

// Delete score - accessible by teacher and admin
router.delete('/:id/score/:scoreId/:scoreType', authorize('teacher', 'admin'), deleteScore);

module.exports = router; 