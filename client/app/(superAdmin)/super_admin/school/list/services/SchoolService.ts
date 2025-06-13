import { School } from '@/types/school';

// This is a mock service that simulates API calls
// In a real application, these would make actual API requests

// Sample data
const mockSchools: School[] = [
	{
		id: 1,
		name: 'Green Valley International School',
		logo: '/placeholder-avatar.png',
		email: 'info@greenvalley.edu',
		phone: '+1 (555) 123-4567',
		isEmailVerified: true,
		address: '123 Education St, Learning City, LC 12345',
		adminName: 'Jane Smith',
		adminEmail: 'jane.smith@greenvalley.edu',
		plan: 'Pro',
		tagline: 'Empowering Future Leaders',
	},
	{
		id: 2,
		name: 'Sunrise Academy',
		logo: '/placeholder-avatar.png',
		email: 'contact@sunriseacademy.org',
		phone: '+1 (555) 987-6543',
		isEmailVerified: false,
		address: '456 Knowledge Ave, Wisdom Town, WT 67890',
		adminName: 'John Doe',
		adminEmail: 'john.doe@sunriseacademy.org',
		plan: 'Basic',
		tagline: 'Inspiring Excellence in Education',
	},
	{
		id: 3,
		name: 'Metropolitan High School',
		logo: '/placeholder-avatar.png',
		email: 'office@metrohs.edu',
		phone: '+1 (555) 321-7654',
		isEmailVerified: true,
		address: '789 Scholar Blvd, Academic Heights, AH 54321',
		adminName: 'Emily Johnson',
		adminEmail: 'emily.johnson@metrohs.edu',
		plan: 'Premium',
		tagline: 'Where Knowledge Meets Innovation',
	},
	{
		id: 4,
		name: 'Oakridge Elementary',
		logo: '/placeholder-avatar.png',
		email: 'info@oakridge.edu',
		phone: '+1 (555) 456-7890',
		isEmailVerified: true,
		address: '321 Elementary Rd, Kidsville, KV 98765',
		adminName: 'Michael Brown',
		adminEmail: 'michael.brown@oakridge.edu',
		plan: 'Basic',
		tagline: 'Nurturing Young Minds',
	},
	{
		id: 5,
		name: 'Global Education Center',
		logo: '/placeholder-avatar.png',
		email: 'contact@globaledu.org',
		phone: '+1 (555) 789-0123',
		isEmailVerified: false,
		address: '555 International Ave, Worldview City, WC 45678',
		adminName: 'Sarah Wilson',
		adminEmail: 'sarah.wilson@globaledu.org',
		plan: 'Pro',
		tagline: 'Connecting Cultures Through Learning',
	},
];

export const SchoolService = {
	// Get all schools
	getSchools: async (): Promise<School[]> => {
		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 500));
		return [...mockSchools];
	},

	// Get a single school by ID
	getSchoolById: async (id: number): Promise<School | null> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return mockSchools.find((school) => school.id === id) || null;
	},

	// Create a new school
	createSchool: async (schoolData: Omit<School, 'id'>): Promise<School> => {
		await new Promise((resolve) => setTimeout(resolve, 400));

		const newSchool: School = {
			id: Math.max(...mockSchools.map((s) => s.id)) + 1,
			...schoolData,
		};

		mockSchools.push(newSchool);
		return newSchool;
	},

	// Update a school
	updateSchool: async (
		id: number,
		schoolData: Partial<School>,
	): Promise<School | null> => {
		await new Promise((resolve) => setTimeout(resolve, 400));
		const schoolIndex = mockSchools.findIndex((school) => school.id === id);
		if (schoolIndex === -1) return null;

		const updatedSchool = {
			...mockSchools[schoolIndex],
			...schoolData,
		};

		// In a real application, this would update the backend
		mockSchools[schoolIndex] = updatedSchool;
		return updatedSchool;
	},

	// Delete a school
	deleteSchool: async (id: number): Promise<boolean> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		const schoolIndex = mockSchools.findIndex((school) => school.id === id);
		if (schoolIndex === -1) return false;

		// In a real application, this would delete from the backend
		mockSchools.splice(schoolIndex, 1);
		return true;
	},

	// Export schools data (mock implementation)
	exportSchools: async (format: string): Promise<string> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		if (format === 'csv') {
			// Create CSV content
			const header =
				'ID,Name,Email,Phone,Address,Admin Name,Admin Email,Plan,Verified\n';
			const rows = mockSchools
				.map(
					(school) =>
						`${school.id},"${school.name}","${school.email}","${school.phone}","${school.address}","${school.adminName}","${school.adminEmail}","${school.plan}",${school.isEmailVerified}`,
				)
				.join('\n');

			return header + rows;
		}

		// Default: return JSON
		return JSON.stringify(mockSchools, null, 2);
	},
};
