const AcademicCalendar = require('../models/AcademicCalendar');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Get academic calendar
exports.getCalendar = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const query = academicYear ? { academicYear } : {};

    const calendar = await AcademicCalendar.findOne(query)
      .populate('events.organizer', 'firstName lastName email')
      .populate('events.participants', 'firstName lastName email')
      .populate('examSchedules.invigilator', 'user');

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching academic calendar',
      error: err.message
    });
  }
};

// Create academic calendar
exports.createCalendar = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating academic calendar',
      error: err.message
    });
  }
};

// Update academic calendar
exports.updateCalendar = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'terms' && key !== 'holidays' && key !== 'events' && key !== 'examSchedules') {
        calendar[key] = req.body[key];
      }
    });

    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating academic calendar',
      error: err.message
    });
  }
};

// Add term
exports.addTerm = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    calendar.terms.push(req.body);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding term',
      error: err.message
    });
  }
};

// Add holiday
exports.addHoliday = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    calendar.holidays.push(req.body);
    await calendar.save();

    // Send notification to all users about the holiday
    const notificationEmail = {
      subject: `New Holiday: ${req.body.name}`,
      html: `
        <h1>New Holiday Announcement</h1>
        <p>Dear Staff and Students,</p>
        <p>A new holiday has been added to the academic calendar:</p>
        <ul>
          <li>Name: ${req.body.name}</li>
          <li>Date: ${new Date(req.body.date).toLocaleDateString()}</li>
          <li>Type: ${req.body.type}</li>
          ${req.body.description ? `<li>Description: ${req.body.description}</li>` : ''}
        </ul>
      `
    };

    // TODO: Send to all users
    // await sendEmail({ email: user.email, ...notificationEmail });

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding holiday',
      error: err.message
    });
  }
};

// Add event
exports.addEvent = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    const event = {
      ...req.body,
      organizer: req.user._id
    };

    calendar.events.push(event);
    await calendar.save();

    // Send notification to participants
    if (event.participants && event.participants.length > 0) {
      const notificationEmail = {
        subject: `New Event: ${event.title}`,
        html: `
          <h1>New Event Announcement</h1>
          <p>Dear Participant,</p>
          <p>You have been invited to a new event:</p>
          <ul>
            <li>Title: ${event.title}</li>
            <li>Date: ${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}</li>
            <li>Type: ${event.type}</li>
            ${event.location ? `<li>Location: ${event.location}</li>` : ''}
            ${event.description ? `<li>Description: ${event.description}</li>` : ''}
          </ul>
        `
      };

      // TODO: Send to participants
      // await sendEmail({ email: participant.email, ...notificationEmail });
    }

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding event',
      error: err.message
    });
  }
};

// Add exam schedule
exports.addExamSchedule = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    calendar.examSchedules.push(req.body);
    await calendar.save();

    // Send notification to class students and invigilator
    const notificationEmail = {
      subject: `New Exam Schedule: ${req.body.subject}`,
      html: `
        <h1>New Exam Schedule</h1>
        <p>Dear Student/Teacher,</p>
        <p>A new exam has been scheduled:</p>
        <ul>
          <li>Subject: ${req.body.subject}</li>
          <li>Date: ${new Date(req.body.date).toLocaleDateString()}</li>
          <li>Time: ${req.body.startTime} - ${req.body.endTime}</li>
          ${req.body.venue ? `<li>Venue: ${req.body.venue}</li>` : ''}
        </ul>
      `
    };

    // TODO: Send to class students and invigilator
    // await sendEmail({ email: user.email, ...notificationEmail });

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding exam schedule',
      error: err.message
    });
  }
};

// Update term
exports.updateTerm = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    const term = calendar.terms.id(req.params.termId);
    if (!term) {
      return res.status(404).json({
        success: false,
        message: 'Term not found'
      });
    }

    Object.assign(term, req.body);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating term',
      error: err.message
    });
  }
};

// Update holiday
exports.updateHoliday = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    const holiday = calendar.holidays.id(req.params.holidayId);
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      });
    }

    Object.assign(holiday, req.body);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating holiday',
      error: err.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    const event = calendar.events.id(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    Object.assign(event, req.body);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: err.message
    });
  }
};

// Update exam schedule
exports.updateExamSchedule = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    const examSchedule = calendar.examSchedules.id(req.params.examId);
    if (!examSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Exam schedule not found'
      });
    }

    Object.assign(examSchedule, req.body);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating exam schedule',
      error: err.message
    });
  }
};

// Delete term
exports.deleteTerm = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    calendar.terms = calendar.terms.filter(term => term._id.toString() !== req.params.termId);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting term',
      error: err.message
    });
  }
};

// Delete holiday
exports.deleteHoliday = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    calendar.holidays = calendar.holidays.filter(holiday => holiday._id.toString() !== req.params.holidayId);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting holiday',
      error: err.message
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    calendar.events = calendar.events.filter(event => event._id.toString() !== req.params.eventId);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: err.message
    });
  }
};

// Delete exam schedule
exports.deleteExamSchedule = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: 'Academic calendar not found'
      });
    }

    calendar.examSchedules = calendar.examSchedules.filter(exam => exam._id.toString() !== req.params.examId);
    await calendar.save();

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting exam schedule',
      error: err.message
    });
  }
}; 