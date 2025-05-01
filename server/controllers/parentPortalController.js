const ParentPortal = require('../models/ParentPortal');
const Student = require('../models/Student');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Get parent portal
exports.getParentPortal = async (req, res) => {
  try {
    const portal = await ParentPortal.findOne({ parent: req.user._id })
      .populate('students.student', 'user')
      .populate('students.class', 'name')
      .populate('communications.sender', 'firstName lastName email')
      .populate('feePayments.student', 'user')
      .populate('attendance.student', 'user')
      .populate('progressReports.student', 'user');

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: portal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parent portal',
      error: err.message
    });
  }
};

// Add student to parent portal
exports.addStudent = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    // Check if student exists and belongs to the parent
    const student = await Student.findOne({
      _id: studentId,
      parent: req.user._id
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or does not belong to you'
      });
    }

    let portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      portal = await ParentPortal.create({
        parent: req.user._id,
        students: [{ student: studentId, class: classId }]
      });
    } else {
      // Check if student is already added
      const studentExists = portal.students.some(
        s => s.student.toString() === studentId
      );

      if (studentExists) {
        return res.status(400).json({
          success: false,
          message: 'Student already added to portal'
        });
      }

      portal.students.push({ student: studentId, class: classId });
      await portal.save();
    }

    res.status(200).json({
      success: true,
      data: portal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding student to portal',
      error: err.message
    });
  }
};

// Send communication to parent
exports.sendCommunication = async (req, res) => {
  try {
    const { parentId, subject, message, attachments } = req.body;

    const portal = await ParentPortal.findOne({ parent: parentId });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    const communication = {
      sender: req.user._id,
      subject,
      message,
      attachments
    };

    portal.communications.push(communication);
    await portal.save();

    // Send email notification
    const notificationEmail = {
      subject: `New Communication: ${subject}`,
      html: `
        <h1>New Communication</h1>
        <p>Dear Parent,</p>
        <p>You have received a new communication:</p>
        <h2>${subject}</h2>
        <p>${message}</p>
      `
    };

    // TODO: Send to parent's email
    // await sendEmail({ email: parent.email, ...notificationEmail });

    res.status(200).json({
      success: true,
      data: portal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error sending communication',
      error: err.message
    });
  }
};

// Add fee payment
exports.addFeePayment = async (req, res) => {
  try {
    const { studentId, term, academicYear, amount, paymentMethod, receipt } = req.body;

    const portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    // Check if student belongs to parent
    const studentExists = portal.students.some(
      s => s.student.toString() === studentId
    );

    if (!studentExists) {
      return res.status(400).json({
        success: false,
        message: 'Student not found in your portal'
      });
    }

    const payment = {
      student: studentId,
      term,
      academicYear,
      amount,
      paymentMethod,
      receipt,
      paymentDate: new Date()
    };

    portal.feePayments.push(payment);
    await portal.save();

    // Send payment confirmation email
    const notificationEmail = {
      subject: 'Fee Payment Confirmation',
      html: `
        <h1>Fee Payment Confirmation</h1>
        <p>Dear Parent,</p>
        <p>Your fee payment has been received:</p>
        <ul>
          <li>Student: ${studentId}</li>
          <li>Term: ${term}</li>
          <li>Academic Year: ${academicYear}</li>
          <li>Amount: ${amount}</li>
          <li>Payment Method: ${paymentMethod}</li>
        </ul>
      `
    };

    // TODO: Send to parent's email
    // await sendEmail({ email: parent.email, ...notificationEmail });

    res.status(200).json({
      success: true,
      data: portal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding fee payment',
      error: err.message
    });
  }
};

// Add attendance record
exports.addAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    const portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    // Check if student belongs to parent
    const studentExists = portal.students.some(
      s => s.student.toString() === studentId
    );

    if (!studentExists) {
      return res.status(400).json({
        success: false,
        message: 'Student not found in your portal'
      });
    }

    const attendance = {
      student: studentId,
      date,
      status,
      remarks
    };

    portal.attendance.push(attendance);
    await portal.save();

    // Send notification for absences
    if (status === 'absent') {
      const notificationEmail = {
        subject: 'Student Absence Notification',
        html: `
          <h1>Student Absence Notification</h1>
          <p>Dear Parent,</p>
          <p>Your child was absent on ${new Date(date).toLocaleDateString()}:</p>
          ${remarks ? `<p>Remarks: ${remarks}</p>` : ''}
        `
      };

      // TODO: Send to parent's email
      // await sendEmail({ email: parent.email, ...notificationEmail });
    }

    res.status(200).json({
      success: true,
      data: portal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding attendance record',
      error: err.message
    });
  }
};

// Add progress report
exports.addProgressReport = async (req, res) => {
  try {
    const { studentId, term, academicYear, subjects, overallGrade, averageGradePoint, overallPosition, totalStudents, attendance, teacherComments, principalComments } = req.body;

    const portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    // Check if student belongs to parent
    const studentExists = portal.students.some(
      s => s.student.toString() === studentId
    );

    if (!studentExists) {
      return res.status(400).json({
        success: false,
        message: 'Student not found in your portal'
      });
    }

    const progressReport = {
      student: studentId,
      term,
      academicYear,
      subjects,
      overallGrade,
      averageGradePoint,
      overallPosition,
      totalStudents,
      attendance,
      teacherComments,
      principalComments,
      generatedAt: new Date()
    };

    portal.progressReports.push(progressReport);
    await portal.save();

    // Send progress report email
    const notificationEmail = {
      subject: `Progress Report - ${term} ${academicYear}`,
      html: `
        <h1>Progress Report</h1>
        <p>Dear Parent,</p>
        <p>Your child's progress report for ${term} ${academicYear} is now available:</p>
        <ul>
          <li>Overall Grade: ${overallGrade}</li>
          <li>Average Grade Point: ${averageGradePoint}</li>
          <li>Position: ${overallPosition} out of ${totalStudents}</li>
        </ul>
        <p>Please log in to your parent portal to view the complete report.</p>
      `
    };

    // TODO: Send to parent's email
    // await sendEmail({ email: parent.email, ...notificationEmail });

    res.status(200).json({
      success: true,
      data: portal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding progress report',
      error: err.message
    });
  }
};

// Mark communication as read
exports.markCommunicationAsRead = async (req, res) => {
  try {
    const portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    const communication = portal.communications.id(req.params.communicationId);
    if (!communication) {
      return res.status(404).json({
        success: false,
        message: 'Communication not found'
      });
    }

    communication.read = true;
    await portal.save();

    res.status(200).json({
      success: true,
      data: portal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error marking communication as read',
      error: err.message
    });
  }
};

// Get fee payment history
exports.getFeePaymentHistory = async (req, res) => {
  try {
    const { studentId, term, academicYear } = req.query;

    const portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    let payments = portal.feePayments;

    // Filter by student
    if (studentId) {
      payments = payments.filter(p => p.student.toString() === studentId);
    }

    // Filter by term
    if (term) {
      payments = payments.filter(p => p.term === term);
    }

    // Filter by academic year
    if (academicYear) {
      payments = payments.filter(p => p.academicYear === academicYear);
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee payment history',
      error: err.message
    });
  }
};

// Get attendance history
exports.getAttendanceHistory = async (req, res) => {
  try {
    const { studentId, startDate, endDate } = req.query;

    const portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    let attendance = portal.attendance;

    // Filter by student
    if (studentId) {
      attendance = attendance.filter(a => a.student.toString() === studentId);
    }

    // Filter by date range
    if (startDate && endDate) {
      attendance = attendance.filter(a => {
        const date = new Date(a.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance history',
      error: err.message
    });
  }
};

// Get progress reports
exports.getProgressReports = async (req, res) => {
  try {
    const { studentId, term, academicYear } = req.query;

    const portal = await ParentPortal.findOne({ parent: req.user._id });

    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Parent portal not found'
      });
    }

    let reports = portal.progressReports;

    // Filter by student
    if (studentId) {
      reports = reports.filter(r => r.student.toString() === studentId);
    }

    // Filter by term
    if (term) {
      reports = reports.filter(r => r.term === term);
    }

    // Filter by academic year
    if (academicYear) {
      reports = reports.filter(r => r.academicYear === academicYear);
    }

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress reports',
      error: err.message
    });
  }
}; 