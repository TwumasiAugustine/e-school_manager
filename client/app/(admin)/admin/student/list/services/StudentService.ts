import { AdmissionFormData } from '@/types/admission';

// Mock data for demonstration. Replace with real API calls in production.
let mockStudents: AdmissionFormData[] = [
  {
    grNumber: 'GR001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    dob: '2012-05-10',
    classSection: '6 A - English',
    sessionYear: '2024-2025',
    gender: 'Male',
    admissionDate: '2024-04-01',
    address: '123 Main St, City',
    bloodGroup: 'A+',
    guardianEmail: 'parent1@example.com',
    guardianFirstName: 'Raj',
    guardianLastName: 'Sharma',
    guardianMobile: '9876543210',
    status: 'active',
  },
  {
    grNumber: 'GR002',
    firstName: 'Isha',
    lastName: 'Patel',
    dob: '2011-11-22',
    classSection: '6 B - Science',
    sessionYear: '2024-2025',
    gender: 'Female',
    admissionDate: '2024-04-01',
    address: '456 Park Ave, City',
    bloodGroup: 'B+',
    guardianEmail: 'parent2@example.com',
    guardianFirstName: 'Meena',
    guardianLastName: 'Patel',
    guardianMobile: '9123456789',
    status: 'inactive',
  },
  {
    grNumber: 'GR003',
    firstName: 'Kabir',
    lastName: 'Singh',
    dob: '2012-08-15',
    classSection: '6 A - English',
    sessionYear: '2025-2026',
    gender: 'Male',
    admissionDate: '2025-04-01',
    address: '789 Lake Rd, City',
    bloodGroup: 'O-',
    guardianEmail: 'parent3@example.com',
    guardianFirstName: 'Sunita',
    guardianLastName: 'Singh',
    guardianMobile: '9988776655',
    status: 'active',
  },
];

export const StudentService = {
  getStudents: async (): Promise<AdmissionFormData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...mockStudents];
  },

  setStudents: async (students: AdmissionFormData[]): Promise<void> => {
    mockStudents = [...students];
  },

  addStudent: async (student: AdmissionFormData): Promise<AdmissionFormData> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockStudents.push(student);
    return student;
  },

  updateStudent: async (grNumber: string, data: Partial<AdmissionFormData>): Promise<AdmissionFormData | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const idx = mockStudents.findIndex((s) => s.grNumber === grNumber);
    if (idx === -1) return null;
    mockStudents[idx] = { ...mockStudents[idx], ...data };
    return mockStudents[idx];
  },

  deleteStudent: async (grNumber: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const idx = mockStudents.findIndex((s) => s.grNumber === grNumber);
    if (idx === -1) return false;
    mockStudents.splice(idx, 1);
    return true;
  },

  setInactive: async (grNumbers: string[]): Promise<void> => {
    mockStudents = mockStudents.map((s) => grNumbers.includes(s.grNumber) ? { ...s, status: 'inactive' } : s);
  },

  restore: async (grNumbers: string[]): Promise<void> => {
    mockStudents = mockStudents.map((s) => grNumbers.includes(s.grNumber) ? { ...s, status: 'active' } : s);
  },
};
