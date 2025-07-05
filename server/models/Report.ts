import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Assuming User model interface exists
import { IClass } from './Class'; // Assuming Class model interface exists
import { IStudent } from './Student'; // Assuming Student model interface exists
import { ITeacher } from './Teacher'; // Assuming Teacher model interface exists

// Interface for Report Parameters subdocument
interface IReportParameters {
	startDate?: Date;
	endDate?: Date;
	academicYear?: string;
	term?: 'First Term' | 'Second Term' | 'Third Term';
	semester?: Types.ObjectId; // Reference to Semester
	class?: Types.ObjectId | IClass;
	subject?: string;
	student?: Types.ObjectId | IStudent;
	teacher?: Types.ObjectId | ITeacher;
	// Add any other relevant parameters
}

// Interface for Chart subdocument
interface IChart extends Types.Subdocument {
	type: 'bar' | 'line' | 'pie' | 'scatter' | 'table';
	title?: string;
	data: any; // Use a more specific type if possible, e.g., { labels: string[], datasets: any[] }
	options?: any; // Chart.js options or similar
}

// Interface for Metric subdocument
interface IMetric extends Types.Subdocument {
	name: string;
	value: any; // Can be number, string, etc.
	unit?: string;
	trend?: 'up' | 'down' | 'stable';
	percentageChange?: number;
}

// Interface for Insight subdocument
interface IInsight extends Types.Subdocument {
	category: string;
	description: string;
	recommendations?: string[];
}

// Interface for Export File subdocument
interface IExportFile {
	filename: string;
	path: string;
	size: number;
}

// Interface for Export subdocument
interface IReportExport {
	format: 'pdf' | 'excel' | 'csv' | 'json';
	file?: IExportFile;
	generatedAt?: Date;
}

// Interface for Schedule subdocument
interface IReportSchedule {
	frequency?:
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'quarterly'
		| 'yearly'
		| 'custom';
	nextRun?: Date;
	lastRun?: Date;
	recipients?: (Types.ObjectId | IUser)[];
}

// Interface for Previous Version subdocument
interface IPreviousVersion extends Types.Subdocument {
	version: number;
	data: any; // Store the previous report data
	createdAt: Date;
}

// Interface for Report document
export interface IReport extends Document {
	title: string;
	type: 'academic' | 'financial' | 'attendance' | 'performance' | 'custom';
	description?: string;
	parameters?: IReportParameters;
	data: any; // The main data payload of the report, structure depends on the report type
	charts?: Types.DocumentArray<IChart>;
	metrics?: Types.DocumentArray<IMetric>;
	insights?: Types.DocumentArray<IInsight>;
	export?: IReportExport;
	createdBy: Types.ObjectId | IUser;
	status: 'draft' | 'generating' | 'completed' | 'archived';
	schedule?: IReportSchedule;
	tags?: string[];
	version: number;
	previousVersions?: Types.DocumentArray<IPreviousVersion>;
	createdAt: Date;
	updatedAt: Date;
}

const reportParametersSchema = new Schema<IReportParameters>(
	{
		startDate: Date,
		endDate: Date,
		academicYear: String,
		term: {
			type: String,
			enum: ['First Term', 'Second Term', 'Third Term'],
		},
		semester: {
			type: Schema.Types.ObjectId,
			ref: 'Semester',
			required: false,
		},
		class: {
			type: Schema.Types.ObjectId,
			ref: 'Class',
		},
		subject: String,
		student: {
			type: Schema.Types.ObjectId,
			ref: 'Student',
		},
		teacher: {
			type: Schema.Types.ObjectId,
			ref: 'Teacher',
		},
	},
	{ _id: false },
);

const chartSchema = new Schema<IChart>({
  type: {
    type: String,
    enum: ['bar', 'line', 'pie', 'scatter', 'table'],
    required: true
  },
  title: String,
  data: { type: Schema.Types.Mixed, required: true },
  options: Schema.Types.Mixed
});

const metricSchema = new Schema<IMetric>({
  name: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  unit: String,
  trend: {
    type: String,
    enum: ['up', 'down', 'stable']
  },
  percentageChange: Number
});

const insightSchema = new Schema<IInsight>({
  category: { type: String, required: true },
  description: { type: String, required: true },
  recommendations: [String]
});

const exportFileSchema = new Schema<IExportFile>({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true }
}, { _id: false });

const reportExportSchema = new Schema<IReportExport>({
  format: {
    type: String,
    enum: ['pdf', 'excel', 'csv', 'json'],
    default: 'pdf'
  },
  file: exportFileSchema,
  generatedAt: Date
}, { _id: false });

const reportScheduleSchema = new Schema<IReportSchedule>({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']
  },
  nextRun: Date,
  lastRun: Date,
  recipients: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { _id: false });

const previousVersionSchema = new Schema<IPreviousVersion>({
  version: { type: Number, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, required: true }
});


const reportSchema = new Schema<IReport>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['academic', 'financial', 'attendance', 'performance', 'custom'],
    required: true,
    index: true
  },
  description: String,
  parameters: reportParametersSchema,
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  charts: [chartSchema],
  metrics: [metricSchema],
  insights: [insightSchema],
  export: reportExportSchema,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'archived'],
    default: 'draft',
    index: true
  },
  schedule: reportScheduleSchema,
  tags: [String],
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [previousVersionSchema]
}, {
  timestamps: true
});

// Indexes for better query performance
reportSchema.index({ title: 1 });
reportSchema.index({ 'parameters.academicYear': 1 });
reportSchema.index({ 'parameters.term': 1 });
reportSchema.index({ 'parameters.class': 1 });
reportSchema.index({ 'parameters.student': 1 });
reportSchema.index({ 'parameters.teacher': 1 });
reportSchema.index({ 'schedule.nextRun': 1 });

// Pre-save middleware to handle versioning (simplified)
// Consider a more robust versioning strategy if needed
reportSchema.pre<IReport>('save', function(next) {
  if (this.isModified('data') && !this.isNew) {
    // Create a snapshot of the *current* state before modification
    // This requires fetching the original document or careful handling
    // For simplicity, this example just increments version
    // A better approach might involve a separate collection for versions
    this.version += 1;
    // You might want to clear previousVersions or handle it differently
  }
  next();
});

const Report = mongoose.model<IReport>('Report', reportSchema);

export default Report;