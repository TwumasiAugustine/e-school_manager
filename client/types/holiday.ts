export interface Holiday {
  _id: string;
  name: string;
  date: Date;
  type: 'public' | 'school' | 'religious';
  description?: string;
}
