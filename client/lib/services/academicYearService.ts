import type { Semester } from '@/types/semester';

// Mock API call functions (replace with actual API calls)
export const fetchAcademicYearsAPI = async (
	filter: 'all' | 'trashed' = 'all',
): Promise<Semester[]> => {
	console.log(`Fetching academic years with filter: ${filter}`);
	await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
	// Simulate fetching based on filter
	const allSemesters: Semester[] = [
		{
			id: 'sem1',
			name: 'First Semester 2024',
			startMonth: 'January',
			endMonth: 'May',
			isCurrent: true,
			status: 'active',
			system: 'semester',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
		},
		{
			id: 'sem2',
			name: 'Second Semester 2024',
			startMonth: 'August',
			endMonth: 'December',
			status: 'active',
			system: 'semester',
			createdAt: new Date('2024-07-01'),
			updatedAt: new Date('2024-07-01'),
		},
		{
			id: 'sem3',
			name: 'Summer Break 2024',
			startMonth: 'June',
			endMonth: 'July',
			status: 'trashed',
			system: 'semester',
			createdAt: new Date('2024-06-01'),
			updatedAt: new Date('2024-06-01'),
		},
		{
			id: 'sem4',
			name: 'First Semester 2025',
			startMonth: 'January',
			endMonth: 'May',
			status: 'active',
			system: 'semester',
			createdAt: new Date('2025-01-01'),
			updatedAt: new Date('2025-01-01'),
		},
	];
	if (filter === 'trashed') {
		return allSemesters.filter((s) => s.status === 'trashed');
	}
	return allSemesters.filter((s) => s.status !== 'trashed');
};

export const createAcademicYearAPI = async (
	data: Omit<Semester, 'id' | 'isCurrent' | 'status' | 'createdAt' | 'updatedAt'>,
): Promise<Semester> => {
	console.log('Creating academic year:', data);
	await new Promise((resolve) => setTimeout(resolve, 500));
	const now = new Date();
	return {
		...data,
		id: `sem-${Date.now()}`,
		isCurrent: false,
		status: 'active',
		createdAt: now,
		updatedAt: now,
	};
};

export const updateAcademicYearAPI = async (semester: Semester): Promise<Semester> => {
	console.log('Updating academic year:', semester);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return semester;
};

export const deleteAcademicYearAPI = async (id: string | number): Promise<void> => {
	console.log('Deleting academic year:', id);
	await new Promise((resolve) => setTimeout(resolve, 500));
};

export const setCurrentAcademicYearAPI = async (
	id: string | number,
): Promise<Semester> => {
	console.log('Setting current academic year:', id);
	await new Promise((resolve) => setTimeout(resolve, 500));
	// In a real app, this would update the backend and then fetch the updated list
	// For mock, we'll just return a modified semester object
	const now = new Date();
	return {
		id,
		name: 'Updated Semester',
		startMonth: 'Jan',
		endMonth: 'May',
		isCurrent: true,
		status: 'active',
		system: 'semester',
		createdAt: now,
		updatedAt: now,
	};
};
