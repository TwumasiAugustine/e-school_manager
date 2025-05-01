import mongoose, { Schema, Document, Types } from 'mongoose';
import { IBranch } from './Branch'; // Assuming Branch model interface exists
import { ITeacher } from './Teacher'; // Assuming Teacher model interface exists
import { IStudent } from './Student'; // Assuming Student model interface exists
import { IUser } from './User'; // Assuming User model interface exists

// Interface for Subject Schedule subdocument
interface ISubjectSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room?: string;
}

// Interface for Subject subdocument
interface ISubject extends Types.Subdocument {
  name: string;
  teacher?: Types.ObjectId | ITeacher;
  schedule?: ISubjectSchedule[];
}

// Interface for Room subdocument
interface IRoom {
  number?: string;
  floor?: string;
  building?: string;
}

// Interface for Class Facility subdocument
interface IClassFacility {
  type: string;
  description?: string;
}

// Interface for Class Event subdocument
interface IClassEvent extends Types.Subdocument {
  title: string;
  date: Date;
  description?: string;
  type: 'exam' | 'holiday' | 'activity' | 'other';
}

// Interface for Class Attendance subdocument
interface IClassAttendance extends Types.Subdocument {
  date: Date;
  present: (Types.ObjectId | IStudent)[];
  absent: (Types.ObjectId | IStudent)[];
  late: (Types.ObjectId | IStudent)[];
}

// Interface for Announcement Attachment subdocument
interface IAnnouncementAttachment {
  name: string;
  url: string;
}

// Interface for Class Announcement subdocument
interface IClassAnnouncement extends Types.Subdocument {
  title: string;
  content: string;
  date: Date;
  author: Types.ObjectId | IUser;
  attachments?: IAnnouncementAttachment[];
}

// Interface for Class document
export interface IClass extends Document {
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  branch: Types.ObjectId | IBranch;
  classTeacher: Types.ObjectId | ITeacher;
  students: (Types.ObjectId | IStudent)[];
  subjects?: Types.DocumentArray<ISubject>;
  capacity: number;
  currentStrength: number;
  room?: IRoom;
  facilities?: IClassFacility[];
  events?: Types.DocumentArray<IClassEvent>;
  attendance?: Types.DocumentArray<IClassAttendance>;
  announcements?: Types.DocumentArray<IClassAnnouncement>;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  attendancePercentage: number;

  // Methods
  updateStrength(): Promise<void>;
}

const subjectScheduleSchema = new Schema<ISubjectSchedule>({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: String
}, { _id: false });

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  schedule: [subjectScheduleSchema]
});

const roomSchema = new Schema<IRoom>({
  number: String,
  floor: String,
  building: String
}, { _id: false });

const classFacilitySchema = new Schema<IClassFacility>({
    type: { type: String, required: true },
    description: String
}, { _id: false });

const classEventSchema = new Schema<IClassEvent>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  type: {
    type: String,
    enum: ['exam', 'holiday', 'activity', 'other'],
    required: true
  }
});

const classAttendanceSchema = new Schema<IClassAttendance>({
  date: { type: Date, required: true },
  present: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  absent: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  late: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
});

const announcementAttachmentSchema = new Schema<IAnnouncementAttachment>({
    name: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: false });

const classAnnouncementSchema = new Schema<IClassAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [announcementAttachmentSchema]
});


const classSchema = new Schema<IClass>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  classTeacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  subjects: [subjectSchema],
  capacity: {
    type: Number,
    required: true
  },
  currentStrength: {
    type: Number,
    default: 0
  },
  room: roomSchema,
  facilities: [classFacilitySchema],
  events: [classEventSchema],
  attendance: [classAttendanceSchema],
  announcements: [classAnnouncementSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for attendance percentage
classSchema.virtual('attendancePercentage').get(function(this: IClass) {
  if (!this.attendance || this.attendance.length === 0 || this.currentStrength === 0) return 0;
  const totalDays = this.attendance.length;
  const totalPresent = this.attendance.reduce((sum, day) => sum + (day.present?.length ?? 0), 0);
  const totalStudents = this.currentStrength;
  return (totalPresent / (totalDays * totalStudents)) * 100;
});

// Method to update current strength
classSchema.methods.updateStrength = async function(this: IClass): Promise<void> {
  this.currentStrength = this.students?.length ?? 0;
  await this.save();
};

// Indexes for better query performance
classSchema.index({ grade: 1, section: 1, academicYear: 1, branch: 1 }, { unique: true }); // Ensure unique class per branch/year
classSchema.index({ classTeacher: 1 });
classSchema.index({ 'subjects.teacher': 1 });
classSchema.index({ status: 1 });

const Class = mongoose.model<IClass>('Class', classSchema);

export default Class;