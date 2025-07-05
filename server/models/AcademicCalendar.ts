import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Assuming User model interface exists
import { IClass } from './Class'; // Assuming Class model interface exists
import { ITeacher } from './Teacher'; // Assuming Teacher model interface exists

// Interface for Term subdocument
interface ITerm extends Types.Subdocument {
	name: 'First Term' | 'Second Term' | 'Third Term';
	startDate: Date;
	endDate: Date;
	status: 'upcoming' | 'current' | 'completed';
}

// Interface for Holiday subdocument
interface IHoliday extends Types.Subdocument {
	name: string;
	date: Date;
	type: 'public' | 'school' | 'religious';
	description?: string;
}

// Interface for Event subdocument
interface IEvent extends Types.Subdocument {
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	type: 'academic' | 'sports' | 'cultural' | 'parent-teacher' | 'other';
	location?: string;
	organizer?: Types.ObjectId | IUser;
	participants?: (Types.ObjectId | IUser)[];
	status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Interface for Exam Schedule subdocument
interface IExamSchedule extends Types.Subdocument {
	term: 'First Term' | 'Second Term' | 'Third Term';
	subject: string;
	class: Types.ObjectId | IClass;
	date: Date;
	startTime: string;
	endTime: string;
	venue?: string;
	invigilator?: Types.ObjectId | ITeacher;
	status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Interface for AcademicCalendar document
export interface IAcademicCalendar extends Document {
	academicYear: string;
	semesters?: Types.ObjectId[]; // Reference to Semesters
	terms?: Types.DocumentArray<ITerm>;
	holidays: Types.DocumentArray<IHoliday>;
	events: Types.DocumentArray<IEvent>;
	examSchedules?: Types.DocumentArray<IExamSchedule>; // Made optional to match schema
	createdBy: Types.ObjectId | IUser;
	createdAt: Date;
	updatedAt: Date;
}

const termSchema = new Schema<ITerm>({
	name: {
		type: String,
		enum: ['First Term', 'Second Term', 'Third Term'],
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
	status: {
		type: String,
		enum: ['upcoming', 'current', 'completed'],
		default: 'upcoming',
	},
});

const holidaySchema = new Schema<IHoliday>({
	name: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	type: {
		type: String,
		enum: ['public', 'school', 'religious'],
		required: true,
	},
	description: String,
});

const eventSchema = new Schema<IEvent>({
	title: {
		type: String,
		required: true,
	},
	description: String,
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	type: {
		type: String,
		enum: ['academic', 'sports', 'cultural', 'parent-teacher', 'other'],
		required: true,
	},
	location: String,
	organizer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	participants: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	status: {
		type: String,
		enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
		default: 'scheduled',
	},
});

const examScheduleSchema = new Schema<IExamSchedule>({
	term: {
		type: String,
		enum: ['First Term', 'Second Term', 'Third Term'],
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	class: {
		type: Schema.Types.ObjectId,
		ref: 'Class',
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
	venue: String,
	invigilator: {
		type: Schema.Types.ObjectId,
		ref: 'Teacher',
	},
	status: {
		type: String,
		enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
		default: 'scheduled',
	},
});

const academicCalendarSchema = new Schema<IAcademicCalendar>(
	{
		academicYear: {
			type: String,
			required: true,
			index: true,
		},
		semesters: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Semester',
			},
		],
		terms: [termSchema],
		holidays: [holidaySchema],
		events: [eventSchema],
		examSchedules: [examScheduleSchema],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Indexes for better query performance
academicCalendarSchema.index({ 'terms.startDate': 1, 'terms.endDate': 1 });
academicCalendarSchema.index({ 'holidays.date': 1 });
academicCalendarSchema.index({ 'events.startDate': 1, 'events.endDate': 1 });
academicCalendarSchema.index({ 'examSchedules.date': 1 });

const AcademicCalendar = mongoose.model<IAcademicCalendar>('AcademicCalendar', academicCalendarSchema);

export default AcademicCalendar;