// Common types for school-related data
export interface SchoolFormData {
  schoolName: string;
  schoolEmail: string;
  mobile: string;
  address: string;
  tagline: string;
  emergencyContact?: string;
}

// Extended for inquiry purposes
export interface SchoolInquiryData extends SchoolFormData {
  id: number;
  no: number;
  status: string;
  inquiryDate?: string;
  message?: string;
  contactPerson?: string;
}

// School model for listing and management
export interface School {
  id: number;
  name: string;
  logo: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  address: string;
  adminName: string;
  adminEmail: string;
  plan: string;
}
