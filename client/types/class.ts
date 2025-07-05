export interface Teacher {
	id: string;
	name: string;
}

export interface Class {
	id: string;
	name: string;
	grade: string;
	section: string;
	academicYear: string;
	semester?: string; // ObjectId as string, optional
	branch: string; // ObjectId as string
	classTeacher: string; // ObjectId as string
	students: string[]; // Array of student ObjectIds
	subjects?: Subject[];
	capacity: number;
	currentStrength: number;
	room?: Room;
	facilities?: ClassFacility[];
	events?: ClassEvent[];
	attendance?: ClassAttendance[];
	announcements?: ClassAnnouncement[];
	status: 'active' | 'completed' | 'cancelled';
	createdAt: string;
	updatedAt: string;
	tuitionFee?: number; // Keep for compatibility if used in UI
	teacherId?: string; // Alias for classTeacher for backward compatibility
}

export interface Subject {
	name: string;
	teacher?: string;
	schedule?: SubjectSchedule[];
}

export interface SubjectSchedule {
	day:
		| 'Monday'
		| 'Tuesday'
		| 'Wednesday'
		| 'Thursday'
		| 'Friday'
		| 'Saturday';
	startTime: string;
	endTime: string;
	room?: string;
}

export interface Room {
	number?: string;
	floor?: string;
	building?: string;
}

export interface ClassFacility {
	type: string;
	description?: string;
}

export interface ClassEvent {
	title: string;
	date: string;
	description?: string;
	type: 'exam' | 'holiday' | 'activity' | 'other';
}

export interface ClassAttendance {
	date: string;
	present: string[];
	absent: string[];
	late: string[];
}

export interface AnnouncementAttachment {
	name: string;
	url: string;
}

export interface ClassAnnouncement {
	title: string;
	content: string;
	date: string;
	author: string;
	attachments?: AnnouncementAttachment[];
}
