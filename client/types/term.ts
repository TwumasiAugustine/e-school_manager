export interface Term {
  _id: string;
  name: 'First Term' | 'Second Term' | 'Third Term';
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'current' | 'completed';
}
