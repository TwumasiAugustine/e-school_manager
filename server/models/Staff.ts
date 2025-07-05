import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Assuming User model interface exists

// Interface for Salary Allowance/Deduction subdocument
interface ISalaryComponent {
  name: string;
  amount: number;
}

// Interface for Salary subdocument
interface ISalary {
  basic?: number;
  allowances?: ISalaryComponent[];
  deductions?: ISalaryComponent[];
  netSalary?: number; // Consider calculating this dynamically or via hook
}

// Interface for Employment Details subdocument
interface IEmploymentDetails {
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'on_leave' | 'terminated' | 'resigned';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary';
  salary?: ISalary;
}

// Interface for Leave Balance subdocument
interface ILeaveBalance {
  annual?: number;
  sick?: number;
  maternity?: number;
  paternity?: number;
  other?: number;
}

// Interface for Leave Request Attachment subdocument
interface ILeaveAttachment {
  filename: string;
  path: string;
  type: string;
}

// Interface for Leave Request subdocument
interface ILeaveRequest extends Types.Subdocument {
	type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'other';
	startDate: Date;
	endDate: Date;
	reason?: string;
	status: 'pending' | 'approved' | 'rejected' | 'cancelled';
	approvedBy?: Types.ObjectId | IUser;
	approvedAt?: Date;
	attachments?: ILeaveAttachment[];
	semester?: Types.ObjectId;
}

// Interface for Leave History subdocument
interface ILeaveHistory {
	type: string;
	startDate: Date;
	endDate: Date;
	days: number;
	status: string;
}

// Interface for Leave subdocument
interface ILeave {
	balance?: ILeaveBalance;
	requests?: Types.DocumentArray<ILeaveRequest>;
	history?: ILeaveHistory[];
}

// Interface for Performance Review Period subdocument
interface IReviewPeriod {
	startDate: Date;
	endDate: Date;
}

// Interface for Performance Rating subdocument
interface IPerformanceRating {
	category: string;
	score: number;
	comments?: string;
}

// Interface for Performance Goal subdocument
interface IPerformanceGoal {
	description: string;
	deadline?: Date;
	status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

// Interface for Performance Review subdocument
interface IPerformanceReview extends Types.Subdocument {
	period: IReviewPeriod;
	reviewer: Types.ObjectId | IUser;
	ratings?: IPerformanceRating[];
	overallRating?: number;
	strengths?: string[];
	areasForImprovement?: string[];
	goals?: IPerformanceGoal[];
	comments?: string;
	status: 'draft' | 'submitted' | 'acknowledged';
	semester?: Types.ObjectId;
}

// Interface for Achievement subdocument
interface IAchievement extends Types.Subdocument {
	title: string;
	description?: string;
	date: Date;
	category?: string;
	recognition?: string;
}

// Interface for Performance subdocument
interface IPerformance {
	reviews?: Types.DocumentArray<IPerformanceReview>;
	achievements?: Types.DocumentArray<IAchievement>;
}

// Interface for Training Certificate subdocument
interface ITrainingCertificate {
	filename: string;
	path: string;
}

// Interface for Training Feedback subdocument
interface ITrainingFeedback {
	rating?: number;
	comments?: string;
}

// Interface for Training Record subdocument
interface ITrainingRecord extends Types.Subdocument {
	title: string;
	type: 'internal' | 'external' | 'online' | 'workshop' | 'seminar';
	provider?: string;
	startDate?: Date;
	endDate?: Date;
	duration?: string;
	cost?: number;
	status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
	certificate?: ITrainingCertificate;
	feedback?: ITrainingFeedback;
	semester?: Types.ObjectId;
}

// Interface for Certification subdocument
interface ICertification extends Types.Subdocument {
	name: string;
	issuer: string;
	issueDate: Date;
	expiryDate?: Date;
	certificate?: ITrainingCertificate;
}

// Interface for Training subdocument
interface ITraining {
	records?: Types.DocumentArray<ITrainingRecord>;
	certifications?: Types.DocumentArray<ICertification>;
}

// Interface for Staff Document subdocument
interface IStaffDocument extends Types.Subdocument {
	type: 'contract' | 'id' | 'certificate' | 'other';
	title?: string;
	filename: string;
	path: string;
	uploadedAt: Date;
}

// Interface for Emergency Contact subdocument
interface IEmergencyContact {
	name?: string;
	relationship?: string;
	phone?: string;
	address?: string;
}

// Interface for Staff document
export interface IStaff extends Document {
	user: Types.ObjectId | IUser;
	department:
		| 'academic'
		| 'administrative'
		| 'support'
		| 'maintenance'
		| 'security';
	position: string;
	employmentDetails: IEmploymentDetails;
	leave?: ILeave;
	performance?: IPerformance;
	training?: ITraining;
	documents?: Types.DocumentArray<IStaffDocument>;
	emergencyContact?: IEmergencyContact;
	createdAt: Date;
	updatedAt: Date;
}

const salaryComponentSchema = new Schema<ISalaryComponent>(
	{
		name: { type: String, required: true },
		amount: { type: Number, required: true, min: 0 },
	},
	{ _id: false },
);

const salarySchema = new Schema<ISalary>(
	{
		basic: { type: Number, min: 0 },
		allowances: [salaryComponentSchema],
		deductions: [salaryComponentSchema],
		netSalary: { type: Number, min: 0 }, // Consider making this virtual or calculated
	},
	{ _id: false },
);

const employmentDetailsSchema = new Schema<IEmploymentDetails>(
	{
		startDate: {
			type: Date,
			required: true,
		},
		endDate: Date,
		status: {
			type: String,
			enum: ['active', 'on_leave', 'terminated', 'resigned'],
			default: 'active',
			required: true,
		},
		employmentType: {
			type: String,
			enum: ['full-time', 'part-time', 'contract', 'temporary'],
			required: true,
		},
		salary: salarySchema,
	},
	{ _id: false },
);

const leaveBalanceSchema = new Schema<ILeaveBalance>(
	{
		annual: { type: Number, default: 0, min: 0 },
		sick: { type: Number, default: 0, min: 0 },
		maternity: { type: Number, default: 0, min: 0 },
		paternity: { type: Number, default: 0, min: 0 },
		other: { type: Number, default: 0, min: 0 },
	},
	{ _id: false },
);

const leaveAttachmentSchema = new Schema<ILeaveAttachment>(
	{
		filename: { type: String, required: true },
		path: { type: String, required: true },
		type: { type: String, required: true },
	},
	{ _id: false },
);

const leaveRequestSchema = new Schema<ILeaveRequest>({
	type: {
		type: String,
		enum: ['annual', 'sick', 'maternity', 'paternity', 'other'],
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	reason: String,
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected', 'cancelled'],
		default: 'pending',
	},
	approvedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	approvedAt: Date,
	attachments: [leaveAttachmentSchema],
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
});

const leaveHistorySchema = new Schema<ILeaveHistory>(
	{
		type: { type: String, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		days: { type: Number, required: true, min: 0 },
		status: { type: String, required: true },
	},
	{ _id: false },
);

const leaveSchema = new Schema<ILeave>(
	{
		balance: leaveBalanceSchema,
		requests: [leaveRequestSchema],
		history: [leaveHistorySchema],
	},
	{ _id: false },
);

const reviewPeriodSchema = new Schema<IReviewPeriod>(
	{
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
	},
	{ _id: false },
);

const performanceRatingSchema = new Schema<IPerformanceRating>(
	{
		category: { type: String, required: true },
		score: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comments: String,
	},
	{ _id: false },
);

const performanceGoalSchema = new Schema<IPerformanceGoal>(
	{
		description: { type: String, required: true },
		deadline: Date,
		status: {
			type: String,
			enum: ['pending', 'in_progress', 'completed', 'cancelled'],
			default: 'pending',
		},
	},
	{ _id: false },
);

const performanceReviewSchema = new Schema<IPerformanceReview>({
	period: { type: reviewPeriodSchema, required: true },
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
	reviewer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	ratings: [performanceRatingSchema],
	overallRating: {
		type: Number,
		min: 1,
		max: 5,
	},
	strengths: [String],
	areasForImprovement: [String],
	goals: [performanceGoalSchema],
	comments: String,
	status: {
		type: String,
		enum: ['draft', 'submitted', 'acknowledged'],
		default: 'draft',
	},
});

const achievementSchema = new Schema<IAchievement>({
	title: { type: String, required: true },
	description: String,
	date: { type: Date, required: true },
	category: String,
	recognition: String,
});

const performanceSchema = new Schema<IPerformance>(
	{
		reviews: [performanceReviewSchema],
		achievements: [achievementSchema],
	},
	{ _id: false },
);

const trainingCertificateSchema = new Schema<ITrainingCertificate>(
	{
		filename: { type: String, required: true },
		path: { type: String, required: true },
	},
	{ _id: false },
);

const trainingFeedbackSchema = new Schema<ITrainingFeedback>(
	{
		rating: { type: Number, min: 1, max: 5 },
		comments: String,
	},
	{ _id: false },
);

const trainingRecordSchema = new Schema<ITrainingRecord>({
	title: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['internal', 'external', 'online', 'workshop', 'seminar'],
		required: true,
	},
	provider: String,
	startDate: Date,
	endDate: Date,
	duration: String,
	cost: { type: Number, min: 0 },
	status: {
		type: String,
		enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
		default: 'scheduled',
	},
	certificate: trainingCertificateSchema,
	feedback: trainingFeedbackSchema,
	semester: {
		type: Schema.Types.ObjectId,
		ref: 'Semester',
	},
});

const certificationSchema = new Schema<ICertification>({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: Date,
  certificate: trainingCertificateSchema
});

const trainingSchema = new Schema<ITraining>({
  records: [trainingRecordSchema],
  certifications: [certificationSchema]
}, { _id: false });

const staffDocumentSchema = new Schema<IStaffDocument>({
  type: {
    type: String,
    enum: ['contract', 'id', 'certificate', 'other'],
    required: true
  },
  title: String,
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const emergencyContactSchema = new Schema<IEmergencyContact>({
  name: String,
  relationship: String,
  phone: String,
  address: String
}, { _id: false });


const staffSchema = new Schema<IStaff>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Assuming one staff profile per user
  },
  department: {
    type: String,
    enum: ['academic', 'administrative', 'support', 'maintenance', 'security'],
    required: true,
    index: true
  },
  position: {
    type: String,
    required: true
  },
  employmentDetails: { type: employmentDetailsSchema, required: true },
  leave: leaveSchema,
  performance: performanceSchema,
  training: trainingSchema,
  documents: [staffDocumentSchema],
  emergencyContact: emergencyContactSchema
}, {
  timestamps: true
});

// Indexes for better query performance
staffSchema.index({ department: 1 });
staffSchema.index({ 'employmentDetails.status': 1 });
staffSchema.index({ 'leave.requests.status': 1 });
staffSchema.index({ 'performance.reviews.period.startDate': 1, 'performance.reviews.period.endDate': 1 });
staffSchema.index({ 'training.records.status': 1 });

// Add pre-save hook to calculate net salary if needed
staffSchema.pre<IStaff>('save', function(next) {
    if (this.isModified('employmentDetails.salary') && this.employmentDetails.salary) {
        const salary = this.employmentDetails.salary;
        const basic = salary.basic ?? 0;
        const totalAllowances = salary.allowances?.reduce((sum, a) => sum + a.amount, 0) ?? 0;
        const totalDeductions = salary.deductions?.reduce((sum, d) => sum + d.amount, 0) ?? 0;
        salary.netSalary = basic + totalAllowances - totalDeductions;
    }
    next();
});

const Staff = mongoose.model<IStaff>('Staff', staffSchema);

export default Staff;