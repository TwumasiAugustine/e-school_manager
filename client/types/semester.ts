export interface Semester {
  id: string | number;
  name: string;
  startMonth: string;
  endMonth: string;
  isCurrent?: boolean; // To match the "Current" column in the image
  status?: 'active' | 'trashed'; // For "All | Trashed" filter
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
