import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Assuming User model interface exists
import { IClass } from './Class'; // Assuming Class model interface exists

// Interface for Qualification subdocument
interface IQualification extends Types.Subdocument {
  degree: string;
  institution: string;
  year?: number;
  specialization?: string;
}

// Interface for Experience subdocument
interface IExperience extends Types.Subdocument {
  school: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  responsibilities?: string[];
}

// Interface for Schedule Period subdocument
interface ISchedulePeriod {
  startTime: string;
  endTime: string;
  class?: Types.ObjectId | IClass;
  subject?: string;
}

// Interface for Daily Schedule subdocument
interface IDailySchedule extends Types.Subdocument {
	day:
		| 'Monday'
		| 'Tuesday'
		| 'Wednesday'
		| 'Thursday'
		| 'Friday'
		| 'Saturday';
	periods?: ISchedulePeriod[];
	semester?: Types.ObjectId;
}

// Interface for Teacher Document subdocument
interface ITeacherDocument extends Types.Subdocument {
	type: string; // e.g., 'resume', 'certificate', 'id'
	name: string;
	url: string; // URL to the stored document
	uploadedAt: Date;
}

// Interface for Performance Evaluation subdocument
interface IPerformanceEvaluation extends Types.Subdocument {
	date: Date;
	evaluator?: Types.ObjectId | IUser;
	rating?: number; // e.g., 1-5 scale
	comments?: string;
	areasOfImprovement?: string[];
	semester?: Types.ObjectId;
}

// Interface for Performance subdocument
interface ITeacherPerformance {
	evaluations?: Types.DocumentArray<IPerformanceEvaluation>;
	averageRating?: number;
}

// Interface for Responsibility subdocument
interface IResponsibility extends Types.Subdocument {
	type: string; // e.g., 'Class Teacher', 'Subject Coordinator', 'Club Advisor'
	description?: string;
	semester?: Types.ObjectId;
}

// Interface for Achievement subdocument
interface ITeacherAchievement extends Types.Subdocument {
	title: string;
	date: Date;
	description?: string;
	semester?: Types.ObjectId;
}

// Interface for Professional Development subdocument
interface IProfessionalDevelopment extends Types.Subdocument {
	course: string;
	provider?: string;
	date: Date;
	duration?: string;
	certificate?: string; // URL or reference to certificate
	semester?: Types.ObjectId;
}

// Interface for Teacher document
export interface ITeacher extends Document {
	user: Types.ObjectId | IUser; // Link to the User model
	employeeId: string; // Unique employee identifier
	department:
		| 'Mathematics'
		| 'Science'
		| 'English'
		| 'History'
		| 'Arts'
		| 'Physical Education'
		| 'Computer Science'
		| 'Languages'
		| 'Special Education'
		| 'Other';
	subjects: string[];
	classes?: (Types.ObjectId | IClass)[]; // Classes the teacher is assigned to
	qualifications?: Types.DocumentArray<IQualification>;
	experience?: Types.DocumentArray<IExperience>;
	schedule?: Types.DocumentArray<IDailySchedule>;
	documents?: Types.DocumentArray<ITeacherDocument>;
	performance?: ITeacherPerformance;
	status: 'active' | 'inactive' | 'on_leave' | 'resigned';
	responsibilities?: Types.DocumentArray<IResponsibility>;
	achievements?: Types.DocumentArray<ITeacherAchievement>;
	professionalDevelopment?: Types.DocumentArray<IProfessionalDevelopment>;
	createdAt: Date;
	updatedAt: Date;

	// Virtuals
	totalExperience: number;
}

const qualificationSchema = new Schema<IQualification>({
	degree: { type: String, required: true },
	institution: { type: String, required: true },
	year: Number,
	specialization: String,
});

const experienceSchema = new Schema<IExperience>({
	school: { type: String, required: true },
	position: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: Date,
	responsibilities: [String],
});

const schedulePeriodSchema = new Schema<ISchedulePeriod>(
	{
		startTime: { type: String, required: true }, // Consider using a more specific time format or Date
		endTime: { type: String, required: true },
		class: {
			type: Schema.Types.ObjectId,
			ref: 'Class',
		},
		subject: String,
	},
	{ _id: false },
);

const dailyScheduleSchema = new Schema<IDailySchedule>({
	day: {
		type: String,
		enum: [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		],
		required: true,
	},
	periods: [schedulePeriodSchema],
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
});

const teacherDocumentSchema = new Schema<ITeacherDocument>({
	type: { type: String, required: true },
	name: { type: String, required: true },
	url: { type: String, required: true },
	uploadedAt: { type: Date, default: Date.now },
});

const performanceEvaluationSchema = new Schema<IPerformanceEvaluation>({
	date: { type: Date, required: true },
	evaluator: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	rating: { type: Number, min: 1, max: 5 }, // Example scale
	comments: String,
	areasOfImprovement: [String],
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
});

const teacherPerformanceSchema = new Schema<ITeacherPerformance>(
	{
		evaluations: [performanceEvaluationSchema],
		averageRating: {
			type: Number,
			default: 0,
			min: 0,
			// Consider calculating this via hook or virtual based on evaluations
		},
	},
	{ _id: false },
);

const responsibilitySchema = new Schema<IResponsibility>({
	type: { type: String, required: true },
	description: String,
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
});

const teacherAchievementSchema = new Schema<ITeacherAchievement>({
	title: { type: String, required: true },
	date: { type: Date, required: true },
	description: String,
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
});

const professionalDevelopmentSchema = new Schema<IProfessionalDevelopment>({
	course: { type: String, required: true },
	provider: String,
	date: { type: Date, required: true },
	duration: String,
	certificate: String, // URL or path
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
});


const teacherSchema = new Schema<ITeacher>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Assuming one teacher profile per user
    index: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Mathematics', 'Science', 'English', 'History', 'Arts', 'Physical Education', 'Computer Science', 'Languages', 'Special Education', 'Other'],
    index: true
  },
  subjects: {
    type: [String],
    required: true,
    validate: [ (v: string[]) => Array.isArray(v) && v.length > 0, 'At least one subject is required']
  },
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
  qualifications: [qualificationSchema],
  experience: [experienceSchema],
  schedule: [dailyScheduleSchema],
  documents: [teacherDocumentSchema],
  performance: teacherPerformanceSchema,
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'resigned'],
    default: 'active',
    required: true,
    index: true
  },
  responsibilities: [responsibilitySchema],
  achievements: [teacherAchievementSchema],
  professionalDevelopment: [professionalDevelopmentSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total experience in years
teacherSchema.virtual('totalExperience').get(function(this: ITeacher): number {
  if (!this.experience || this.experience.length === 0) return 0;

  return this.experience.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    // If endDate is missing, assume they are still working there (use current date)
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    // Calculate difference in milliseconds and convert to years
    const diffMilliseconds = end.getTime() - start.getTime();
    const years = diffMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Use 365.25 for leap years
    return total + years;
  }, 0);
});

// Pre-save hook to update average rating (example)
teacherSchema.pre<ITeacher>('save', function(next) {
    if (this.isModified('performance.evaluations') && this.performance?.evaluations) {
        const evaluations = this.performance.evaluations;
        if (evaluations.length > 0) {
            const totalRating = evaluations.reduce((sum, evaluation) => sum + (evaluation.rating ?? 0), 0);
            this.performance.averageRating = totalRating / evaluations.length;
        } else {
            this.performance.averageRating = 0;
        }
    }
    next();
});

// Indexes for better query performance
teacherSchema.index({ subjects: 1 });

const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);

export default Teacher;