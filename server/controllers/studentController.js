const Student = require('../models/Student');
const User = require('../models/User');
const Class = require('../models/Class');

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: err.message
    });
  }
};

// Get single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'firstName lastName email phoneNumber address')
      .populate({
        path: 'documents',
        select: 'name url uploadedAt'
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: err.message
    });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      grade,
      section,
      parentGuardian,
      emergencyContact
    } = req.body;

    // Create user first
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'student',
      branch: req.body.branch
    });

    // Create student profile
    const student = await Student.create({
      user: user._id,
      studentId: `STU${Date.now()}`,
      grade,
      section,
      admissionDate: new Date(),
      parentGuardian,
      emergencyContact
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: err.message
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student profile
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // If user data is included, update user profile
    if (req.body.firstName || req.body.lastName || req.body.email) {
      await User.findByIdAndUpdate(student.user, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      });
    }

    res.status(200).json({
      success: true,
      data: updatedStudent
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: err.message
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove student from any classes
    await Class.updateMany(
      { students: student._id },
      { $pull: { students: student._id } }
    );

    // Delete student profile
    await student.remove();

    // Delete associated user
    await User.findByIdAndDelete(student.user);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: err.message
    });
  }
};

// Get student attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const attendance = student.attendance || [];
    const attendancePercentage = student.attendancePercentage;

    res.status(200).json({
      success: true,
      data: {
        attendance,
        attendancePercentage
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: err.message
    });
  }
};

// Update student attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { date, status, notes } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Add attendance record
    student.attendance.push({
      date,
      status,
      notes
    });

    await student.save();

    res.status(200).json({
      success: true,
      data: student.attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance',
      error: err.message
    });
  }
};

// Add document to student profile
exports.addDocument = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const { type, name, url } = req.body;

    student.documents.push({
      type,
      name,
      url,
      uploadedAt: new Date()
    });

    await student.save();

    res.status(200).json({
      success: true,
      data: student.documents
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding document',
      error: err.message
    });
  }
}; 