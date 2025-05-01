const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCalendar,
  createCalendar,
  updateCalendar,
  addTerm,
  addHoliday,
  addEvent,
  addExamSchedule,
  updateTerm,
  updateHoliday,
  updateEvent,
  updateExamSchedule,
  deleteTerm,
  deleteHoliday,
  deleteEvent,
  deleteExamSchedule
} = require('../controllers/academicCalendarController');

// Protect all routes
router.use(protect);

// Get calendar - accessible by all authenticated users
router.get('/', getCalendar);

// Create calendar - admin only
router.post('/', authorize('admin'), createCalendar);

// Update calendar - admin only
router.put('/:id', authorize('admin'), updateCalendar);

// Term routes - admin only
router.post('/:id/terms', authorize('admin'), addTerm);
router.put('/:id/terms/:termId', authorize('admin'), updateTerm);
router.delete('/:id/terms/:termId', authorize('admin'), deleteTerm);

// Holiday routes - admin only
router.post('/:id/holidays', authorize('admin'), addHoliday);
router.put('/:id/holidays/:holidayId', authorize('admin'), updateHoliday);
router.delete('/:id/holidays/:holidayId', authorize('admin'), deleteHoliday);

// Event routes - admin and teachers
router.post('/:id/events', authorize('admin', 'teacher'), addEvent);
router.put('/:id/events/:eventId', authorize('admin', 'teacher'), updateEvent);
router.delete('/:id/events/:eventId', authorize('admin', 'teacher'), deleteEvent);

// Exam schedule routes - admin and teachers
router.post('/:id/exam-schedules', authorize('admin', 'teacher'), addExamSchedule);
router.put('/:id/exam-schedules/:examId', authorize('admin', 'teacher'), updateExamSchedule);
router.delete('/:id/exam-schedules/:examId', authorize('admin', 'teacher'), deleteExamSchedule);

module.exports = router; 