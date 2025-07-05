import mongoose, { Schema, Document, Types } from 'mongoose';
import { IStudent } from './Student'; // Assuming Student model interface exists
import { IClass } from './Class'; // Assuming Class model interface exists
import { ITeacher } from './Teacher'; // Assuming Teacher model interface exists

// Interface for Weights subdocument
interface IWeights {
  classScore: number;
  examScore: number;
}

// Interface for Class Score subdocument
interface IClassScore extends Types.Subdocument {
  type: 'quiz' | 'assignment' | 'project' | 'participation';
  title: string;
  score: number;
  maxScore: number;
  date: Date;
  comments?: string;
}

// Interface for Exam Score subdocument
interface IExamScore extends Types.Subdocument {
  type: 'midterm' | 'final';
  title: string;
  score: number;
  maxScore: number;
  date: Date;
  comments?: string;
}

// Interface for Scores subdocument
interface IScores {
  classScore: Types.DocumentArray<IClassScore>;
  examScore: Types.DocumentArray<IExamScore>;
}

// Interface for Position subdocument
interface IPosition {
  class: number;
  totalStudents: number;
}

// Interface for Grade document
export interface IGrade extends Document {
	student: Types.ObjectId | IStudent;
	class: Types.ObjectId | IClass;
	subject: string;
	term: 'first' | 'second' | 'third';
	semester?: Types.ObjectId; // New field for semester reference
	academicYear: string;
	weights: IWeights;
	scores: IScores;
	totalScore: number;
	maxTotalScore: number;
	percentage: number;
	grade:
		| 'A+'
		| 'A'
		| 'A-'
		| 'B+'
		| 'B'
		| 'B-'
		| 'C+'
		| 'C'
		| 'C-'
		| 'D+'
		| 'D'
		| 'D-'
		| 'F';
	gradePoint: number;
	status: 'pass' | 'fail' | 'incomplete';
	position: IPosition;
	teacher: Types.ObjectId | ITeacher;
	lastUpdated: Date;
	createdAt: Date;
	updatedAt: Date;

	// Methods
	calculateGrade(): void;
	calculatePosition(): Promise<void>;
}

const weightsSchema = new Schema<IWeights>(
	{
		classScore: {
			type: Number,
			default: 50,
			min: 0,
			max: 100,
		},
		examScore: {
			type: Number,
			default: 50,
			min: 0,
			max: 100,
		},
	},
	{ _id: false },
);

const classScoreSchema = new Schema<IClassScore>({
	type: {
		type: String,
		enum: ['quiz', 'assignment', 'project', 'participation'],
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		required: true,
		min: 0,
	},
	maxScore: {
		type: Number,
		required: true,
		min: 1, // Max score should be at least 1
	},
	date: {
		type: Date,
		default: Date.now,
	},
	comments: String,
});

const examScoreSchema = new Schema<IExamScore>({
	type: {
		type: String,
		enum: ['midterm', 'final'],
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		required: true,
		min: 0,
	},
	maxScore: {
		type: Number,
		required: true,
		min: 1,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	comments: String,
});

const scoresSchema = new Schema<IScores>(
	{
		classScore: [classScoreSchema],
		examScore: [examScoreSchema],
	},
	{ _id: false },
);

const positionSchema = new Schema<IPosition>(
	{
		class: {
			type: Number,
			default: 0,
		},
		totalStudents: {
			type: Number,
			default: 0,
		},
	},
	{ _id: false },
);

const gradeSchema = new Schema<IGrade>(
	{
		student: {
			type: Schema.Types.ObjectId,
			ref: 'Student',
			required: true,
			index: true,
		},
		class: {
			type: Schema.Types.ObjectId,
			ref: 'Class',
			required: true,
			index: true,
		},
		subject: {
			type: String,
			required: true,
			index: true,
		},
		term: {
			type: String,
			enum: ['first', 'second', 'third'],
			required: true,
			index: true,
		},
		semester: {
			type: Schema.Types.ObjectId,
			ref: 'Semester',
			required: false,
		},
		academicYear: {
			type: String,
			required: true,
			index: true,
		},
		weights: {
			type: weightsSchema,
			default: () => ({ classScore: 50, examScore: 50 }),
		},
		scores: scoresSchema,
		totalScore: {
			type: Number,
			default: 0,
		},
		maxTotalScore: {
			type: Number,
			default: 0,
		},
		percentage: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		grade: {
			type: String,
			enum: [
				'A+',
				'A',
				'A-',
				'B+',
				'B',
				'B-',
				'C+',
				'C',
				'C-',
				'D+',
				'D',
				'D-',
				'F',
			],
			default: 'F',
		},
		gradePoint: {
			type: Number,
			default: 0,
			min: 0,
			max: 4.0,
		},
		status: {
			type: String,
			enum: ['pass', 'fail', 'incomplete'],
			default: 'incomplete',
		},
		position: {
			type: positionSchema,
			default: () => ({ class: 0, totalStudents: 0 }),
		},
		teacher: {
			type: Schema.Types.ObjectId,
			ref: 'Teacher',
			required: true,
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

// Calculate grade statistics
gradeSchema.methods.calculateGrade = function(this: IGrade): void {
  // Calculate class score
  const classScores = this.scores.classScore;
  const classTotal = classScores.reduce((sum, score) => sum + score.score, 0);
  const classMaxTotal = classScores.reduce((sum, score) => sum + score.maxScore, 0);
  const classPercentage = classMaxTotal > 0 ? (classTotal / classMaxTotal) * 100 : 0;

  // Calculate exam score
  const examScores = this.scores.examScore;
  const examTotal = examScores.reduce((sum, score) => sum + score.score, 0);
  const examMaxTotal = examScores.reduce((sum, score) => sum + score.maxScore, 0);
  const examPercentage = examMaxTotal > 0 ? (examTotal / examMaxTotal) * 100 : 0;

  // Calculate weighted total percentage
  this.percentage = (
    (classPercentage * (this.weights.classScore / 100)) +
    (examPercentage * (this.weights.examScore / 100))
  );

  // Calculate total score and max total score (optional, for reference)
  this.totalScore = classTotal + examTotal;
  this.maxTotalScore = classMaxTotal + examMaxTotal;

  // Determine grade based on percentage
  if (this.percentage >= 97) this.grade = 'A+';
  else if (this.percentage >= 93) this.grade = 'A';
  else if (this.percentage >= 90) this.grade = 'A-';
  else if (this.percentage >= 87) this.grade = 'B+';
  else if (this.percentage >= 83) this.grade = 'B';
  else if (this.percentage >= 80) this.grade = 'B-';
  else if (this.percentage >= 77) this.grade = 'C+';
  else if (this.percentage >= 73) this.grade = 'C';
  else if (this.percentage >= 70) this.grade = 'C-';
  else if (this.percentage >= 67) this.grade = 'D+';
  else if (this.percentage >= 63) this.grade = 'D';
  else if (this.percentage >= 60) this.grade = 'D-';
  else this.grade = 'F';

  // Calculate grade point
  const gradePoints: { [key: string]: number } = {
    'A+': 4.0,
    'A': 3.7,
    'A-': 3.3,
    'B+': 3.0,
    'B': 2.7,
    'B-': 2.3,
    'C+': 2.0,
    'C': 1.7,
    'C-': 1.3,
    'D+': 1.0,
    'D': 0.7,
    'D-': 0.3,
    'F': 0.0
  };
  this.gradePoint = gradePoints[this.grade] ?? 0;

  // Determine status
  this.status = this.percentage >= 60 ? 'pass' : 'fail'; // Assuming 60% is passing
  this.lastUpdated = new Date();
};

// Calculate position in class
gradeSchema.methods.calculatePosition = async function(this: IGrade): Promise<void> {
  const GradeModel = this.constructor as mongoose.Model<IGrade>; // Cast constructor to Model type
  const grades = await GradeModel.find({
    class: this.class,
    subject: this.subject,
    term: this.term,
    academicYear: this.academicYear
  }).sort({ percentage: -1 });

  const position = grades.findIndex(grade => grade._id.equals(this._id)) + 1;
  this.position = {
    class: position > 0 ? position : 0, // Handle case where grade might not be found (shouldn't happen)
    totalStudents: grades.length
  };
};

// Pre-save middleware to calculate grade and position
gradeSchema.pre<IGrade>('save', async function(next) {
  // Only recalculate if scores have been modified or it's a new document with scores
  if (this.isModified('scores') || (this.isNew && (this.scores.classScore.length > 0 || this.scores.examScore.length > 0))) {
    this.calculateGrade();
    // Position calculation depends on other grades, might be better to trigger this separately
    // or ensure atomicity if called here. For simplicity, calling it here.
    await this.calculatePosition();
  }
  next();
});

// Indexes
gradeSchema.index({ student: 1, class: 1, subject: 1, term: 1, academicYear: 1 }, { unique: true });

const Grade = mongoose.model<IGrade>('Grade', gradeSchema);

export default Grade;