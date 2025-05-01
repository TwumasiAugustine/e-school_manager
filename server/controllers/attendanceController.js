const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Get class attendance for a specific date
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;
    const attendanceDate = date ? new Date(date) : new Date();

    const attendance = await Attendance.findOne({
      class: classId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999))
      }
    }).populate('records.student', 'user');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No attendance record found for this date'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: err.message
    });
  }
};

// Mark attendance for a class
exports.markAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    // Check if class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Create or update attendance record
    let attendance = await Attendance.findOne({
      class: classId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (attendance) {
      // Update existing attendance
      attendance.records = records;
    } else {
      // Create new attendance record
      attendance = await Attendance.create({
        class: classId,
        date: new Date(date),
        records
      });
    }

    // Update student attendance records
    for (const record of records) {
      const student = await Student.findById(record.student);
      if (student) {
        student.attendance.push({
          date: new Date(date),
          status: record.status,
          notes: record.notes
        });

        // Update attendance percentage
        const totalDays = student.attendance.length;
        const presentDays = student.attendance.filter(a => a.status === 'present').length;
        student.attendancePercentage = (presentDays / totalDays) * 100;

        await student.save();

        // Send attendance notification email if absent
        if (record.status === 'absent') {
          const studentUser = await Student.findById(record.student).populate('user');
          const attendanceEmail = emailTemplates.attendance(
            `${studentUser.user.firstName} ${studentUser.user.lastName}`,
            date,
            'absent'
          );

          await sendEmail({
            email: studentUser.user.email,
            ...attendanceEmail
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: err.message
    });
  }
};

// Get student attendance history
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('user', 'firstName lastName')
      .select('attendance attendancePercentage');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        student: {
          name: `${student.user.firstName} ${student.user.lastName}`,
          id: student._id
        },
        attendance: student.attendance,
        attendancePercentage: student.attendancePercentage
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance',
      error: err.message
    });
  }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;

    const attendance = await Attendance.find({
      class: classId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('records.student', 'user');

    // Calculate statistics
    const stats = {
      totalDays: attendance.length,
      averageAttendance: 0,
      students: {}
    };

    if (attendance.length > 0) {
      const studentCount = attendance[0].records.length;
      let totalPresent = 0;

      // Initialize student stats
      attendance[0].records.forEach(record => {
        stats.students[record.student._id] = {
          name: `${record.student.user.firstName} ${record.student.user.lastName}`,
          present: 0,
          absent: 0,
          late: 0,
          percentage: 0
        };
      });

      // Calculate attendance for each student
      attendance.forEach(day => {
        day.records.forEach(record => {
          if (record.status === 'present') {
            stats.students[record.student._id].present++;
            totalPresent++;
          } else if (record.status === 'absent') {
            stats.students[record.student._id].absent++;
          } else if (record.status === 'late') {
            stats.students[record.student._id].late++;
          }
        });
      });

      // Calculate percentages
      Object.keys(stats.students).forEach(studentId => {
        const student = stats.students[studentId];
        student.percentage = (student.present / stats.totalDays) * 100;
      });

      stats.averageAttendance = (totalPresent / (attendance.length * studentCount)) * 100;
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics',
      error: err.message
    });
  }
}; 