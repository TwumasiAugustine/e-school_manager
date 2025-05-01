import mongoose, { Schema, Document, Types } from 'mongoose';
import { IStudent } from './Student'; // Assuming Student model interface exists
import { IUser } from './User'; // Assuming User model interface exists
import { IClass } from './Class'; // Assuming Class model interface exists

// Interface for Payment Record subdocument
interface IPaymentRecord extends Types.Subdocument {
  amount: number;
  paymentDate: Date;
  method: 'cash' | 'card' | 'bank_transfer' | 'online';
  transactionId?: string;
  receivedBy?: Types.ObjectId | IUser;
  notes?: string;
}

// Interface for Fee Structure Item subdocument
interface IFeeStructureItem extends Types.Subdocument {
  type: string; // e.g., 'tuition', 'transport', 'books', 'activity'
  description?: string;
  amount: number;
  frequency: 'monthly' | 'termly' | 'annually' | 'one-time';
}

// Interface for Fee document
export interface IFee extends Document {
  student: Types.ObjectId | IStudent;
  class: Types.ObjectId | IClass;
  academicYear: string;
  term: 'First Term' | 'Second Term' | 'Third Term';
  feeStructure: Types.DocumentArray<IFeeStructureItem>;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  dueDate: Date;
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'waived';
  payments: Types.DocumentArray<IPaymentRecord>;
  notes?: string;
  createdBy: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const paymentRecordSchema = new Schema<IPaymentRecord>({
  amount: { type: Number, required: true, min: 0 },
  paymentDate: { type: Date, required: true, default: Date.now },
  method: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'online'],
    required: true
  },
  transactionId: String,
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
});

const feeStructureItemSchema = new Schema<IFeeStructureItem>({
  type: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true, min: 0 },
  frequency: {
    type: String,
    enum: ['monthly', 'termly', 'annually', 'one-time'],
    required: true
  }
});

const feeSchema = new Schema<IFee>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  academicYear: {
    type: String,
    required: true,
    index: true
  },
  term: {
    type: String,
    enum: ['First Term', 'Second Term', 'Third Term'],
    required: true
  },
  feeStructure: {
    type: [feeStructureItemSchema],
    required: true,
    validate: [ (v: any[]) => Array.isArray(v) && v.length > 0, 'Fee structure cannot be empty']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    // Consider calculating this via hook or virtual
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'partially_paid', 'paid', 'overdue', 'waived'],
    default: 'pending',
    required: true,
    index: true
  },
  payments: [paymentRecordSchema],
  notes: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Pre-save hook to calculate totalAmount and balance
feeSchema.pre<IFee>('save', function(next) {
  // Calculate total amount from fee structure
  this.totalAmount = this.feeStructure.reduce((sum, item) => sum + item.amount, 0);

  // Calculate amount paid from payments
  this.amountPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate balance
  this.balance = this.totalAmount - this.amountPaid;

  // Update status based on balance and due date (optional)
  if (this.balance <= 0) {
    this.status = 'paid';
  } else if (this.amountPaid > 0) {
    this.status = 'partially_paid';
  } else if (new Date() > this.dueDate) {
    this.status = 'overdue';
  } else {
    this.status = 'pending';
  }
  // Note: Status logic might need refinement based on specific requirements (e.g., handling 'waived')

  next();
});

// Indexes
feeSchema.index({ student: 1, academicYear: 1, term: 1 });
feeSchema.index({ status: 1, dueDate: 1 });

const Fee = mongoose.model<IFee>('Fee', feeSchema);

export default Fee;
