import mongoose, { Schema, Document, Types } from 'mongoose';
import { IClass } from './Class';
import { IStudent } from './Student';
import { IUser } from './User';

// Interface for Attendance Record subdocument within the main Attendance document
interface IAttendanceRecord extends Types.Subdocument {
  student: Types.ObjectId | IStudent;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

// Interface for the main Attendance document (representing a class's attendance for a specific day)
export interface IAttendance extends Document {
  class: Types.ObjectId | IClass;
  date: Date;
  records: Types.DocumentArray<IAttendanceRecord>;
  recordedBy: Types.ObjectId | IUser; // User (teacher/admin) who recorded the attendance
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the Attendance Record subdocument
const attendanceRecordSchema = new Schema<IAttendanceRecord>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required for each attendance record.']
  },
  status: {
    type: String,
    enum: {
        values: ['present', 'absent', 'late', 'excused'],
        message: 'Attendance status must be one of: present, absent, late, excused.'
    },
    required: [true, 'Attendance status is required for each student.']
  },
  notes: {
      type: String,
      trim: true
  }
}, { _id: false }); // No separate _id for subdocuments

// Schema for the main Attendance document
const attendanceSchema = new Schema<IAttendance>({
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required to record attendance.'],
    index: true // Index for faster querying by class
  },
  date: {
    type: Date,
    required: [true, 'Date is required for the attendance record.'],
    index: true // Index for faster querying by date
  },
  records: {
      type: [attendanceRecordSchema],
      required: true,
      // Ensure there's at least one record if the array exists
      validate: [ (v: IAttendanceRecord[]) => Array.isArray(v) && v.length > 0, 'At least one student attendance record is required.']
  },
  recordedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID of the recorder is required.']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Compound index to ensure only one attendance record per class per day
// Use $gte and $lt in queries on 'date' to match the specific day
attendanceSchema.index({ class: 1, date: 1 }, { unique: true });

// Pre-save hook example (optional): Validate student IDs belong to the class
attendanceSchema.pre('save', async function(next) {
  if (this.isModified('records')) {
    const classDoc = await mongoose.model('Class').findById(this.class).select('students');
    if (!classDoc) {
      return next(new Error('Associated class not found.'));
    }
    const classStudentIds: string[] = (classDoc.students as Types.ObjectId[]).map((id: Types.ObjectId) => id.toString());
    const recordStudentIds = this.records.map(record => record.student.toString());

    for (const studentId of recordStudentIds) {
      if (!classStudentIds.includes(studentId)) {
        return next(new Error(`Student with ID ${studentId} does not belong to class ${this.class}.`));
      }
    }
  }
  next();
});

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);

export default Attendance;
