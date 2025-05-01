const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipients: req.user._id
    })
      .populate('sender', 'firstName lastName')
      .sort('-createdAt');

    // Mark notifications as read
    await Notification.updateMany(
      {
        recipients: req.user._id,
        read: false
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: err.message
    });
  }
};

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, recipients, type, link } = req.body;

    // Create notification
    const notification = await Notification.create({
      title,
      message,
      recipients,
      type,
      link,
      sender: req.user._id
    });

    // Send email notifications to recipients
    const recipientUsers = await User.find({ _id: { $in: recipients } });
    for (const user of recipientUsers) {
      const notificationEmail = {
        subject: title,
        html: `
          <h1>${title}</h1>
          <p>${message}</p>
          ${link ? `<p>Click <a href="${link}">here</a> to view more details.</p>` : ''}
        `
      };

      await sendEmail({
        email: user.email,
        ...notificationEmail
      });
    }

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: err.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is a recipient
    if (!notification.recipients.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: err.message
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is the sender or an admin
    if (notification.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await notification.remove();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: err.message
    });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipients: req.user._id,
      read: false
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: err.message
    });
  }
}; 