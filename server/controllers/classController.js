const Class = require('../models/Class');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher', 'user')
      .populate('students', 'user')
      .populate('subjects.teacher', 'user')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching classes',
      error: err.message
    });
  }
};

// Get single class
exports.getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate({
        path: 'classTeacher',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'students',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .populate({
        path: 'subjects.teacher',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class',
      error: err.message
    });
  }
};

// Create class
exports.createClass = async (req, res) => {
  try {
    const {
      name,
      grade,
      section,
      academicYear,
      branch,
      classTeacher,
      capacity,
      subjects
    } = req.body;

    // Create class
    const classData = await Class.create({
      name,
      grade,
      section,
      academicYear,
      branch,
      classTeacher,
      capacity,
      subjects
    });

    // Update teacher's classes
    await Teacher.findByIdAndUpdate(classTeacher, {
      $push: { classes: classData._id }
    });

    // Update subject teachers' classes
    for (const subject of subjects) {
      if (subject.teacher) {
        await Teacher.findByIdAndUpdate(subject.teacher, {
          $push: { classes: classData._id }
        });
      }
    }

    res.status(201).json({
      success: true,
      data: classData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating class',
      error: err.message
    });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // If class teacher is being changed
    if (req.body.classTeacher && req.body.classTeacher !== classData.classTeacher.toString()) {
      // Remove class from old teacher's classes
      await Teacher.findByIdAndUpdate(classData.classTeacher, {
        $pull: { classes: classData._id }
      });

      // Add class to new teacher's classes
      await Teacher.findByIdAndUpdate(req.body.classTeacher, {
        $push: { classes: classData._id }
      });
    }

    // If subjects are being updated
    if (req.body.subjects) {
      // Remove class from old subject teachers' classes
      for (const subject of classData.subjects) {
        if (subject.teacher) {
          await Teacher.findByIdAndUpdate(subject.teacher, {
            $pull: { classes: classData._id }
          });
        }
      }

      // Add class to new subject teachers' classes
      for (const subject of req.body.subjects) {
        if (subject.teacher) {
          await Teacher.findByIdAndUpdate(subject.teacher, {
            $push: { classes: classData._id }
          });
        }
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedClass
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating class',
      error: err.message
    });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Remove class from class teacher's classes
    await Teacher.findByIdAndUpdate(classData.classTeacher, {
      $pull: { classes: classData._id }
    });

    // Remove class from subject teachers' classes
    for (const subject of classData.subjects) {
      if (subject.teacher) {
        await Teacher.findByIdAndUpdate(subject.teacher, {
          $pull: { classes: classData._id }
        });
      }
    }

    await classData.remove();

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting class',
      error: err.message
    });
  }
};

// Add student to class
exports.addStudent = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    const student = await Student.findById(req.body.studentId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if class is at capacity
    if (classData.currentStrength >= classData.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Class is at full capacity'
      });
    }

    // Check if student is already in class
    if (classData.students.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already in this class'
      });
    }

    // Add student to class
    classData.students.push(student._id);
    await classData.updateStrength();

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding student to class',
      error: err.message
    });
  }
};

// Remove student from class
exports.removeStudent = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    const student = await Student.findById(req.params.studentId);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove student from class
    classData.students = classData.students.filter(
      id => id.toString() !== student._id.toString()
    );
    await classData.updateStrength();

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error removing student from class',
      error: err.message
    });
  }
};

// Add announcement
exports.addAnnouncement = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const { title, content, attachments } = req.body;

    classData.announcements.push({
      title,
      content,
      date: new Date(),
      author: req.user._id,
      attachments
    });

    await classData.save();

    res.status(200).json({
      success: true,
      data: classData.announcements
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding announcement',
      error: err.message
    });
  }
}; 