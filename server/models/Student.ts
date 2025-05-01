import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Assuming User model interface exists

// Interface for Address subdocument
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Interface for Parent/Guardian subdocument
interface IParentGuardian {
  name?: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  address?: IAddress;
}

// Interface for Emergency Contact subdocument
interface IEmergencyContact {
  name?: string;
  relationship?: string;
  phoneNumber?: string;
}

// Interface for Medical Info subdocument
interface IMedicalInfo {
  bloodGroup?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
}

// Interface for Academic History subdocument
interface IAcademicHistory extends Types.Subdocument {
  year: string;
  grade: string;
  school: string;
  performance?: string; // e.g., GPA, Rank, Comments
}

// Interface for Extracurricular Activity subdocument
interface IExtracurricularActivity extends Types.Subdocument {
  activity: string;
  role?: string;
  achievements?: string[];
}

// Interface for Attendance Record subdocument
interface IAttendanceRecord extends Types.Subdocument {
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

// Interface for Document subdocument
interface IDocumentRecord extends Types.Subdocument {
  type: string; // e.g., 'birth_certificate', 'transcript', 'report_card'
  name: string;
  url: string; // URL to the stored document
  uploadedAt: Date;
}

// Interface for Student document
export interface IStudent extends Document {
  user: Types.ObjectId | IUser; // Link to the User model (if student has login)
  studentId: string; // Unique student identifier
  grade: string;
  section: string;
  admissionDate: Date;
  parentGuardian?: IParentGuardian;
  emergencyContact?: IEmergencyContact;
  medicalInfo?: IMedicalInfo;
  academicHistory?: Types.DocumentArray<IAcademicHistory>;
  extracurricularActivities?: Types.DocumentArray<IExtracurricularActivity>;
  attendance?: Types.DocumentArray<IAttendanceRecord>;
  documents?: Types.DocumentArray<IDocumentRecord>;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  attendancePercentage: number;
}

const addressSchema = new Schema<IAddress>({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
}, { _id: false });

const parentGuardianSchema = new Schema<IParentGuardian>({
  name: String,
  relationship: String,
  phoneNumber: String,
  email: { type: String, lowercase: true, trim: true },
  address: addressSchema
}, { _id: false });

const emergencyContactSchema = new Schema<IEmergencyContact>({
  name: String,
  relationship: String,
  phoneNumber: String
}, { _id: false });

const medicalInfoSchema = new Schema<IMedicalInfo>({
  bloodGroup: String,
  allergies: [String],
  medications: [String],
  conditions: [String]
}, { _id: false });

const academicHistorySchema = new Schema<IAcademicHistory>({
  year: { type: String, required: true },
  grade: { type: String, required: true },
  school: { type: String, required: true },
  performance: String
});

const extracurricularActivitySchema = new Schema<IExtracurricularActivity>({
  activity: { type: String, required: true },
  role: String,
  achievements: [String]
});

const attendanceRecordSchema = new Schema<IAttendanceRecord>({
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: true
  },
  notes: String
});

const documentRecordSchema = new Schema<IDocumentRecord>({
  type: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }, // Add validation for URL format if needed
  uploadedAt: { type: Date, default: Date.now }
});


const studentSchema = new Schema<IStudent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // unique: true // A user might be linked to multiple student profiles (e.g., siblings), consider if this should be unique
    index: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  grade: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    required: true
  },
  parentGuardian: parentGuardianSchema,
  emergencyContact: emergencyContactSchema,
  medicalInfo: medicalInfoSchema,
  academicHistory: [academicHistorySchema],
  extracurricularActivities: [extracurricularActivitySchema],
  attendance: [attendanceRecordSchema],
  documents: [documentRecordSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'transferred'],
    default: 'active',
    required: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for attendance percentage
studentSchema.virtual('attendancePercentage').get(function(this: IStudent): number {
  if (!this.attendance || this.attendance.length === 0) return 0;
  const presentCount = this.attendance.filter(a => a.status === 'present' || a.status === 'excused').length; // Consider if excused counts as present
  const totalRelevantDays = this.attendance.length; // Or filter out specific statuses if needed
  return totalRelevantDays > 0 ? (presentCount / totalRelevantDays) * 100 : 0;
});

// Indexes for better query performance
studentSchema.index({ grade: 1, section: 1 });
studentSchema.index({ 'parentGuardian.email': 1 });
studentSchema.index({ status: 1, admissionDate: -1 });

const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student;