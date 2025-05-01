import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Assuming User model interface exists
import { IStudent } from './Student'; // Assuming Student model interface exists
import { IClass } from './Class'; // Assuming Class model interface exists

// Interface for Linked Student subdocument
interface ILinkedStudent {
  student: Types.ObjectId | IStudent;
  class: Types.ObjectId | IClass;
}

// Interface for Communication Attachment subdocument
interface ICommunicationAttachment {
  filename: string;
  path: string;
  type: string;
}

// Interface for Communication subdocument
interface ICommunication extends Types.Subdocument {
  sender: Types.ObjectId | IUser;
  subject: string;
  message: string;
  attachments?: ICommunicationAttachment[];
  read: boolean;
  createdAt: Date;
}

// Interface for Fee Payment Receipt subdocument
interface IFeePaymentReceipt {
  filename: string;
  path: string;
}

// Interface for Fee Payment subdocument
interface IFeePayment extends Types.Subdocument {
  student: Types.ObjectId | IStudent;
  term: 'First Term' | 'Second Term' | 'Third Term';
  academicYear: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  receipt?: IFeePaymentReceipt;
}

// Interface for Attendance Record subdocument
interface IAttendanceRecord extends Types.Subdocument {
  student: Types.ObjectId | IStudent;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

// Interface for Subject Grade within Progress Report
interface ISubjectGrade {
  subject: string;
  grade: string;
  gradePoint: number;
  position: number;
  totalStudents: number;
  comments?: string;
}

// Interface for Attendance Summary within Progress Report
interface IProgressReportAttendance {
  present: number;
  absent: number;
  late: number;
  excused: number;
}

// Interface for Progress Report subdocument
interface IProgressReport extends Types.Subdocument {
  student: Types.ObjectId | IStudent;
  term: 'First Term' | 'Second Term' | 'Third Term';
  academicYear: string;
  subjects: ISubjectGrade[];
  overallGrade: string;
  averageGradePoint: number;
  overallPosition: number;
  totalStudents: number;
  attendance: IProgressReportAttendance;
  teacherComments?: string;
  principalComments?: string;
  generatedAt: Date;
}

// Interface for Notification subdocument
interface INotification extends Types.Subdocument {
  type: 'fee' | 'attendance' | 'grade' | 'communication' | 'event';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Interface for ParentPortal document
export interface IParentPortal extends Document {
  parent: Types.ObjectId | IUser;
  students: ILinkedStudent[];
  communications?: Types.DocumentArray<ICommunication>;
  feePayments?: Types.DocumentArray<IFeePayment>;
  attendance?: Types.DocumentArray<IAttendanceRecord>;
  progressReports?: Types.DocumentArray<IProgressReport>;
  notifications?: Types.DocumentArray<INotification>;
  createdAt: Date;
  updatedAt: Date;
}

const linkedStudentSchema = new Schema<ILinkedStudent>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  }
}, { _id: false });

const communicationAttachmentSchema = new Schema<ICommunicationAttachment>({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, required: true }
}, { _id: false });

const communicationSchema = new Schema<ICommunication>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  attachments: [communicationAttachmentSchema],
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const feePaymentReceiptSchema = new Schema<IFeePaymentReceipt>({
    filename: { type: String, required: true },
    path: { type: String, required: true }
}, { _id: false });

const feePaymentSchema = new Schema<IFeePayment>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  term: {
    type: String,
    enum: ['First Term', 'Second Term', 'Third Term'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'check', 'momo'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  receipt: feePaymentReceiptSchema
});

const attendanceRecordSchema = new Schema<IAttendanceRecord>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: true
  },
  remarks: String
});

const subjectGradeSchema = new Schema<ISubjectGrade>({
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    gradePoint: { type: Number, required: true, min: 0 },
    position: { type: Number, required: true, min: 0 },
    totalStudents: { type: Number, required: true, min: 0 },
    comments: String
}, { _id: false });

const progressReportAttendanceSchema = new Schema<IProgressReportAttendance>({
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    late: { type: Number, default: 0 },
    excused: { type: Number, default: 0 }
}, { _id: false });

const progressReportSchema = new Schema<IProgressReport>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  term: {
    type: String,
    enum: ['First Term', 'Second Term', 'Third Term'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  subjects: {
      type: [subjectGradeSchema],
      required: true,
      validate: [ (v: ISubjectGrade[]) => Array.isArray(v) && v.length > 0, 'At least one subject grade is required']
  },
  overallGrade: {
    type: String,
    required: true
  },
  averageGradePoint: {
    type: Number,
    required: true,
    min: 0
  },
  overallPosition: {
    type: Number,
    required: true,
    min: 0
  },
  totalStudents: {
    type: Number,
    required: true,
    min: 0
  },
  attendance: { type: progressReportAttendanceSchema, required: true },
  teacherComments: String,
  principalComments: String,
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

const notificationSchema = new Schema<INotification>({
  type: {
    type: String,
    enum: ['fee', 'attendance', 'grade', 'communication', 'event'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const parentPortalSchema = new Schema<IParentPortal>({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Assuming one portal per parent user
  },
  students: {
      type: [linkedStudentSchema],
      required: true,
      validate: [ (v: ILinkedStudent[]) => Array.isArray(v) && v.length > 0, 'At least one student must be linked']
  },
  communications: [communicationSchema],
  feePayments: [feePaymentSchema],
  attendance: [attendanceRecordSchema],
  progressReports: [progressReportSchema],
  notifications: [notificationSchema]
}, {
  timestamps: true
});

// Indexes for better query performance
parentPortalSchema.index({ parent: 1 });
parentPortalSchema.index({ 'students.student': 1 });
parentPortalSchema.index({ 'feePayments.student': 1, 'feePayments.term': 1, 'feePayments.academicYear': 1 });
parentPortalSchema.index({ 'attendance.student': 1, 'attendance.date': 1 });
parentPortalSchema.index({ 'progressReports.student': 1, 'progressReports.term': 1, 'progressReports.academicYear': 1 });
parentPortalSchema.index({ 'notifications.read': 1, 'notifications.createdAt': -1 });

const ParentPortal = mongoose.model<IParentPortal>('ParentPortal', parentPortalSchema);

export default ParentPortal;