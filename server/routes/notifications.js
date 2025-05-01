const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUserNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// Protect all routes
router.use(protect);

// Get user notifications
router.get('/me', getUserNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Routes accessible by admin and teachers
router
  .route('/')
  .post(authorize('admin', 'teacher'), createNotification);

router
  .route('/:id')
  .put(markAsRead)
  .delete(authorize('admin', 'teacher'), deleteNotification);

module.exports = router; 