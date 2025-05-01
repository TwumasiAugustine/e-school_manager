const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Class = require('../models/Class');

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user', 'firstName lastName email')
      .populate('classes')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: err.message
    });
  }
};

// Get single teacher
exports.getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', 'firstName lastName email phoneNumber address')
      .populate('classes')
      .populate({
        path: 'documents',
        select: 'name url uploadedAt'
      });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher',
      error: err.message
    });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      department,
      subjects,
      qualifications
    } = req.body;

    // Create user first
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'teacher',
      branch: req.body.branch
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      user: user._id,
      employeeId: `EMP${Date.now()}`,
      department,
      subjects,
      qualifications
    });

    res.status(201).json({
      success: true,
      data: teacher
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating teacher',
      error: err.message
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Update teacher profile
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // If user data is included, update user profile
    if (req.body.firstName || req.body.lastName || req.body.email) {
      await User.findByIdAndUpdate(teacher.user, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTeacher
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating teacher',
      error: err.message
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Update classes to remove this teacher
    await Class.updateMany(
      { 'subjects.teacher': teacher._id },
      { $pull: { 'subjects.$.teacher': teacher._id } }
    );

    // Delete teacher profile
    await teacher.remove();

    // Delete associated user
    await User.findByIdAndDelete(teacher.user);

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: err.message
    });
  }
};

// Get teacher's schedule
exports.getSchedule = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate({
        path: 'classes',
        select: 'name grade section'
      });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher.schedule
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule',
      error: err.message
    });
  }
};

// Update teacher's schedule
exports.updateSchedule = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    teacher.schedule = req.body.schedule;
    await teacher.save();

    res.status(200).json({
      success: true,
      data: teacher.schedule
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: err.message
    });
  }
};

// Add performance evaluation
exports.addEvaluation = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const { evaluator, rating, comments, areasOfImprovement } = req.body;

    teacher.performance.evaluations.push({
      date: new Date(),
      evaluator,
      rating,
      comments,
      areasOfImprovement
    });
    
    // Update average rating
    const totalRatings = teacher.performance.evaluations.reduce(
      (sum, evaluation) => sum + evaluation.rating,
      0
    );
    teacher.performance.averageRating =
      totalRatings / teacher.performance.evaluations.length;

    await teacher.save();

    res.status(200).json({
      success: true,
      data: teacher.performance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding evaluation',
      error: err.message
    });
  }
};

// Add professional development record
exports.addProfessionalDevelopment = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const { course, provider, date, duration, certificate } = req.body;

    teacher.professionalDevelopment.push({
      course,
      provider,
      date,
      duration,
      certificate
    });

    await teacher.save();

    res.status(200).json({
      success: true,
      data: teacher.professionalDevelopment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding professional development record',
      error: err.message
    });
  }
}; 