import mongoose, { Schema, Document } from 'mongoose';

export interface ISemester extends Document {
	name: string;
	startMonth: string;
	endMonth: string;
	isCurrent?: boolean;
	status?: 'active' | 'trashed';
	system: 'semester' | 'term';
	createdAt: Date;
	updatedAt: Date;
}

const semesterSchema = new Schema<ISemester>(
	{
		name: { type: String, required: true, trim: true },
		startMonth: { type: String, required: true },
		endMonth: { type: String, required: true },
		isCurrent: { type: Boolean, default: false },
		status: {
			type: String,
			enum: ['active', 'trashed'],
			default: 'active',
		},
		system: {
			type: String,
			enum: ['semester', 'term'],
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Semester = mongoose.model<ISemester>('Semester', semesterSchema);

export default Semester;
