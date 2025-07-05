export interface ExamSchedule {
  _id: string;
  term: 'First Term' | 'Second Term' | 'Third Term';
  subject: string;
  class: string; // Class ID
  date: Date;
  startTime: string;
  endTime: string;
  venue?: string;
  invigilator?: string; // Teacher ID
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
