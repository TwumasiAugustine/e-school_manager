import mongoose, { Schema, Document, Types } from 'mongoose';
import { ITeacher } from './Teacher';

export interface ISubject extends Document {
	name: string;
	code: string;
	type: string;
	bgColor: string;
	image: string;
	trashed?: boolean;
	teachers: (Types.ObjectId | ITeacher)[];
	createdAt: Date;
	updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
	{
		name: { type: String, required: true, trim: true },
		code: { type: String, required: true, trim: true, unique: true },
		type: { type: String, required: true },
		bgColor: { type: String, required: true },
		image: { type: String, required: true },
		trashed: { type: Boolean, default: false },
		teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
	},
	{
		timestamps: true,
	},
);

const Subject = mongoose.model<ISubject>('Subject', subjectSchema);

export default Subject;
