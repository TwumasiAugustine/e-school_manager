import { Semester } from './semester';
import { Term } from './term';
import { Holiday } from './holiday';
import { Event } from './event';
import { ExamSchedule } from './examSchedule';

export interface AcademicCalendar {
	_id: string;
	academicYear: string;
	semesters?: Semester[];
	terms?: Term[];
	holidays: Holiday[];
	events: Event[];
	examSchedules?: ExamSchedule[];
	createdBy: string; // User ID
	createdAt: Date;
	updatedAt: Date;
}
