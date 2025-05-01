const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Get student grades
exports.getStudentGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('class', 'name')
      .populate('teacher', 'user')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student grades',
      error: err.message
    });
  }
};

// Get class grades
exports.getClassGrades = async (req, res) => {
  try {
    const { classId, subject, term, academicYear } = req.query;

    const query = { class: classId };
    if (subject) query.subject = subject;
    if (term) query.term = term;
    if (academicYear) query.academicYear = academicYear;

    const grades = await Grade.find(query)
      .populate('student', 'user')
      .populate('teacher', 'user')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class grades',
      error: err.message
    });
  }
};

// Update grade weights
exports.updateWeights = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    const { classScore, examScore } = req.body;

    // Validate weights sum to 100
    if (classScore + examScore !== 100) {
      return res.status(400).json({
        success: false,
        message: 'Weights must sum to 100'
      });
    }

    grade.weights = {
      classScore,
      examScore
    };

    await grade.save();

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating grade weights',
      error: err.message
    });
  }
};

// Add class score
exports.addClassScore = async (req, res) => {
  try {
    const { studentId, classId, subject, term, academicYear, score } = req.body;

    // Find or create grade record
    let grade = await Grade.findOne({
      student: studentId,
      class: classId,
      subject,
      term,
      academicYear
    });

    if (!grade) {
      grade = await Grade.create({
        student: studentId,
        class: classId,
        subject,
        term,
        academicYear,
        teacher: req.user._id
      });
    }

    // Add class score
    grade.scores.classScore.push(score);
    await grade.save();

    // Send notification to student
    const student = await Student.findById(studentId).populate('user');
    const notificationEmail = {
      subject: `New Class Score Added - ${subject}`,
      html: `
        <h1>New Class Score Added</h1>
        <p>Dear ${student.user.firstName},</p>
        <p>A new class score has been added for ${subject}:</p>
        <ul>
          <li>Type: ${score.type}</li>
          <li>Title: ${score.title}</li>
          <li>Score: ${score.score}/${score.maxScore}</li>
        </ul>
      `
    };

    await sendEmail({
      email: student.user.email,
      ...notificationEmail
    });

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding class score',
      error: err.message
    });
  }
};

// Add exam score
exports.addExamScore = async (req, res) => {
  try {
    const { studentId, classId, subject, term, academicYear, score } = req.body;

    // Find or create grade record
    let grade = await Grade.findOne({
      student: studentId,
      class: classId,
      subject,
      term,
      academicYear
    });

    if (!grade) {
      grade = await Grade.create({
        student: studentId,
        class: classId,
        subject,
        term,
        academicYear,
        teacher: req.user._id
      });
    }

    // Add exam score
    grade.scores.examScore.push(score);
    await grade.save();

    // Send notification to student
    const student = await Student.findById(studentId).populate('user');
    const notificationEmail = {
      subject: `New Exam Score Added - ${subject}`,
      html: `
        <h1>New Exam Score Added</h1>
        <p>Dear ${student.user.firstName},</p>
        <p>A new exam score has been added for ${subject}:</p>
        <ul>
          <li>Type: ${score.type}</li>
          <li>Title: ${score.title}</li>
          <li>Score: ${score.score}/${score.maxScore}</li>
        </ul>
      `
    };

    await sendEmail({
      email: student.user.email,
      ...notificationEmail
    });

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding exam score',
      error: err.message
    });
  }
};

// Update score
exports.updateScore = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    const { scoreId, scoreType, score, maxScore, comments } = req.body;

    // Determine which score array to update
    const scoreArray = scoreType === 'class' ? grade.scores.classScore : grade.scores.examScore;
    const scoreIndex = scoreArray.findIndex(s => s._id.toString() === scoreId);

    if (scoreIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    scoreArray[scoreIndex] = {
      ...scoreArray[scoreIndex].toObject(),
      score,
      maxScore,
      comments
    };

    await grade.save();

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating score',
      error: err.message
    });
  }
};

// Delete score
exports.deleteScore = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    const { scoreId, scoreType } = req.params;

    // Determine which score array to update
    if (scoreType === 'class') {
      grade.scores.classScore = grade.scores.classScore.filter(s => s._id.toString() !== scoreId);
    } else {
      grade.scores.examScore = grade.scores.examScore.filter(s => s._id.toString() !== scoreId);
    }

    await grade.save();

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting score',
      error: err.message
    });
  }
};

// Get grade statistics
exports.getGradeStats = async (req, res) => {
  try {
    const { classId, subject, term, academicYear } = req.query;

    const query = { class: classId };
    if (subject) query.subject = subject;
    if (term) query.term = term;
    if (academicYear) query.academicYear = academicYear;

    const grades = await Grade.find(query)
      .populate('student', 'user');

    const stats = {
      totalStudents: grades.length,
      gradeDistribution: {
        'A+': 0, 'A': 0, 'A-': 0,
        'B+': 0, 'B': 0, 'B-': 0,
        'C+': 0, 'C': 0, 'C-': 0,
        'D+': 0, 'D': 0, 'D-': 0,
        'F': 0
      },
      averageGrade: 0,
      passRate: 0,
      topPerformers: [],
      needsImprovement: [],
      classScoreStats: {
        average: 0,
        highest: 0,
        lowest: 0
      },
      examScoreStats: {
        average: 0,
        highest: 0,
        lowest: 0
      }
    };

    if (grades.length > 0) {
      let totalGradePoints = 0;
      let passingStudents = 0;
      let totalClassScore = 0;
      let totalExamScore = 0;
      let highestClassScore = 0;
      let lowestClassScore = 100;
      let highestExamScore = 0;
      let lowestExamScore = 100;

      grades.forEach(grade => {
        stats.gradeDistribution[grade.grade]++;
        totalGradePoints += grade.gradePoint;

        if (grade.status === 'pass') {
          passingStudents++;
        }

        // Calculate class score statistics
        const classScores = grade.scores.classScore;
        if (classScores.length > 0) {
          const classTotal = classScores.reduce((sum, score) => sum + score.score, 0);
          const classMaxTotal = classScores.reduce((sum, score) => sum + score.maxScore, 0);
          const classPercentage = (classTotal / classMaxTotal) * 100;
          totalClassScore += classPercentage;
          highestClassScore = Math.max(highestClassScore, classPercentage);
          lowestClassScore = Math.min(lowestClassScore, classPercentage);
        }

        // Calculate exam score statistics
        const examScores = grade.scores.examScore;
        if (examScores.length > 0) {
          const examTotal = examScores.reduce((sum, score) => sum + score.score, 0);
          const examMaxTotal = examScores.reduce((sum, score) => sum + score.maxScore, 0);
          const examPercentage = (examTotal / examMaxTotal) * 100;
          totalExamScore += examPercentage;
          highestExamScore = Math.max(highestExamScore, examPercentage);
          lowestExamScore = Math.min(lowestExamScore, examPercentage);
        }

        // Track top performers (A+ and A)
        if (grade.grade === 'A+' || grade.grade === 'A') {
          stats.topPerformers.push({
            student: `${grade.student.user.firstName} ${grade.student.user.lastName}`,
            grade: grade.grade,
            percentage: grade.percentage
          });
        }

        // Track students needing improvement (D+ and below)
        if (['D+', 'D', 'D-', 'F'].includes(grade.grade)) {
          stats.needsImprovement.push({
            student: `${grade.student.user.firstName} ${grade.student.user.lastName}`,
            grade: grade.grade,
            percentage: grade.percentage
          });
        }
      });

      stats.averageGrade = totalGradePoints / grades.length;
      stats.passRate = (passingStudents / grades.length) * 100;

      // Calculate class and exam score statistics
      stats.classScoreStats = {
        average: totalClassScore / grades.length,
        highest: highestClassScore,
        lowest: lowestClassScore
      };

      stats.examScoreStats = {
        average: totalExamScore / grades.length,
        highest: highestExamScore,
        lowest: lowestExamScore
      };

      // Sort top performers and needs improvement
      stats.topPerformers.sort((a, b) => b.percentage - a.percentage);
      stats.needsImprovement.sort((a, b) => a.percentage - b.percentage);
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grade statistics',
      error: err.message
    });
  }
};

// Generate Report Card
exports.generateReportCard = async (req, res) => {
  try {
    const { studentId, term, academicYear } = req.params;

    // Validate input
    if (!studentId || !term || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: studentId, term, academicYear'
      });
    }

    // Fetch student details
    const student = await Student.findById(studentId).populate('user', 'firstName lastName email');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Fetch grades for the specified term and year
    const grades = await Grade.find({
      student: studentId,
      term: term,
      academicYear: academicYear
    })
    .populate('class', 'name')
    .populate('teacher', 'user') // Assuming teacher has a user field with firstName, lastName
    .sort('subject'); // Sort by subject for consistency

    if (!grades || grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No grades found for student ${student.user.firstName} ${student.user.lastName} for ${term} term, ${academicYear}`
      });
    }

    // --- Report Card Data Aggregation ---
    let totalPoints = 0;
    let totalMaxPoints = 0;
    let overallGradePoint = 0;
    let subjectsCount = grades.length;

    grades.forEach(grade => {
      totalPoints += grade.totalScore;
      totalMaxPoints += grade.maxTotalScore; // Ensure maxTotalScore is calculated in the Grade model
      overallGradePoint += grade.gradePoint;
    });

    const overallPercentage = totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : 0;
    const averageGradePoint = subjectsCount > 0 ? overallGradePoint / subjectsCount : 0;

    // Determine overall grade based on average GPA or percentage (example)
    let overallGrade = 'F'; // Default
    // Add logic here to determine overall grade based on school's grading scale

    const reportCardData = {
      student: {
        id: student._id,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        // Add class, roll number etc. if needed
      },
      term: term,
      academicYear: academicYear,
      grades: grades.map(g => ({
        subject: g.subject,
        className: g.class.name,
        teacher: g.teacher.user ? `${g.teacher.user.firstName} ${g.teacher.user.lastName}` : 'N/A',
        scores: g.scores, // Consider summarizing scores for brevity
        totalScore: g.totalScore,
        maxTotalScore: g.maxTotalScore,
        percentage: g.percentage.toFixed(2),
        grade: g.grade,
        gradePoint: g.gradePoint,
        status: g.status,
        position: g.position,
      })),
      summary: {
        totalPoints: totalPoints,
        totalMaxPoints: totalMaxPoints,
        overallPercentage: overallPercentage.toFixed(2),
        averageGradePoint: averageGradePoint.toFixed(2),
        overallGrade: overallGrade, // Add calculated overall grade
        // Add overall status, comments, rank etc.
      }
    };
    // --- End Report Card Data Aggregation ---

    // In a real application, generate a PDF here

    res.status(200).json({
      success: true,
      data: reportCardData
    });

  } catch (err) {
    console.error("Error generating report card:", err);
    res.status(500).json({
      success: false,
      message: 'Error generating report card',
      error: err.message
    });
  }
};