export interface Event {
  _id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'academic' | 'sports' | 'cultural' | 'parent-teacher' | 'other';
  location?: string;
  organizer?: string; // User ID
  participants?: string[]; // User IDs
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
