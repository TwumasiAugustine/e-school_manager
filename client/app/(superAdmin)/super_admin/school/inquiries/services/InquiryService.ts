import { SchoolInquiry } from '../types';

// This is a mock service that simulates API calls
// In a real application, these would make actual API requests

// Sample data
const mockInquiries: SchoolInquiry[] = [
  {
    id: 307,
    no: 1,
    schoolName: 'PEACE SCHOOL',
    mobile: '917349388735',
    schoolEmail: 'saifullahbanakal@gmail.com',
    status: 'Pending',
    address: '123 Main St, City, Country',
    tagline: 'Education for all',
    contactPerson: 'John Doe',
    inquiryDate: '2025-06-10',
    message: 'We are interested in using your management system for our school.'
  },
  {    id: 306,
    no: 2,
    schoolName: 'Moher schools',
    mobile: '08107093637',
    schoolEmail: 'moher@schools.com',
    status: 'Pending',
    address: '456 Oak Ave, Town, Country',
    tagline: 'Quality Education',
    contactPerson: 'Jane Smith',
    inquiryDate: '2025-06-11',
    message: 'Please provide more information about your system features.'
  }
];

export const InquiryService = {
  // Get all inquiries
  getInquiries: async (): Promise<SchoolInquiry[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockInquiries];
  },

  // Get a single inquiry by ID
  getInquiryById: async (id: number): Promise<SchoolInquiry | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInquiries.find(inquiry => inquiry.id === id) || null;
  },

  // Update inquiry status
  updateInquiryStatus: async (id: number, status: string): Promise<SchoolInquiry | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const inquiryIndex = mockInquiries.findIndex(inquiry => inquiry.id === id);
    if (inquiryIndex === -1) return null;
    
    const updatedInquiry = {
      ...mockInquiries[inquiryIndex],
      status
    };
    
    // In a real application, this would update the backend
    mockInquiries[inquiryIndex] = updatedInquiry;
    return updatedInquiry;
  },

  // Delete an inquiry
  deleteInquiry: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const inquiryIndex = mockInquiries.findIndex(inquiry => inquiry.id === id);
    if (inquiryIndex === -1) return false;
    
    // In a real application, this would delete from the backend
    mockInquiries.splice(inquiryIndex, 1);
    return true;
  }
};

export default InquiryService;
