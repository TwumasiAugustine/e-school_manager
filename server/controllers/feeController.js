const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Get all fees
exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate('student', 'user')
      .populate('branch')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fees',
      error: err.message
    });
  }
};

// Get single fee
exports.getFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student', 'user')
      .populate('branch')
      .populate('transactions');

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee',
      error: err.message
    });
  }
};

// Create fee
exports.createFee = async (req, res) => {
  try {
    const { student, amount, dueDate, feeType, description } = req.body;

    // Check if student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create fee
    const fee = await Fee.create({
      student,
      amount,
      dueDate,
      feeType,
      description,
      branch: studentExists.branch
    });

    // Send fee notification email
    const studentUser = await Student.findById(student).populate('user');
    const feeEmail = emailTemplates.feeReminder(
      `${studentUser.user.firstName} ${studentUser.user.lastName}`,
      amount,
      dueDate
    );

    await sendEmail({
      email: studentUser.user.email,
      ...feeEmail
    });

    res.status(201).json({
      success: true,
      data: fee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating fee',
      error: err.message
    });
  }
};

// Update fee
exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee not found'
      });
    }

    const updatedFee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedFee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating fee',
      error: err.message
    });
  }
};

// Delete fee
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee not found'
      });
    }

    await fee.remove();

    res.status(200).json({
      success: true,
      message: 'Fee deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting fee',
      error: err.message
    });
  }
};

// Add payment transaction
exports.addPayment = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee not found'
      });
    }

    const { amount, paymentMethod, transactionId, notes } = req.body;

    // Add transaction
    fee.transactions.push({
      amount,
      paymentMethod,
      transactionId,
      notes,
      date: new Date()
    });

    // Update fee status
    const totalPaid = fee.transactions.reduce((sum, t) => sum + t.amount, 0);
    fee.status = totalPaid >= fee.amount ? 'paid' : 'partial';
    fee.remainingAmount = fee.amount - totalPaid;

    await fee.save();

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding payment',
      error: err.message
    });
  }
};

// Get student fees
exports.getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId })
      .populate('branch')
      .populate('transactions')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student fees',
      error: err.message
    });
  }
};

// Generate fee receipt
exports.generateReceipt = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student', 'user')
      .populate('branch')
      .populate('transactions');

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee not found'
      });
    }

    // Generate receipt data
    const receipt = {
      receiptNumber: `RCP${Date.now()}`,
      date: new Date(),
      student: {
        name: `${fee.student.user.firstName} ${fee.student.user.lastName}`,
        id: fee.student._id
      },
      branch: fee.branch.name,
      feeType: fee.feeType,
      amount: fee.amount,
      paidAmount: fee.transactions.reduce((sum, t) => sum + t.amount, 0),
      remainingAmount: fee.remainingAmount,
      status: fee.status,
      transactions: fee.transactions
    };

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
      error: err.message
    });
  }
}; 