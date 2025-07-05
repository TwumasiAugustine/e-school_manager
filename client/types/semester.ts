export interface Semester {
	id: string | number;
	name: string;
	startMonth: string;
	endMonth: string;
	isCurrent?: boolean; // To match the "Current" column in the image
	status?: 'active' | 'trashed'; // For "All | Trashed" filter
	system: 'semester' | 'term'; // Indicates whether a semester or term system is being used
	createdAt: Date; // Timestamp for when the semester was created
	updatedAt: Date; // Timestamp for when the semester was last updated
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
