import type { Class } from '@/types/class';

export const fetchClassesAPI = async (): Promise<Class[]> => {
	console.log('Fetching classes');
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return [
		{
			id: 'cls1',
			name: 'Class 10-A',
			grade: '10',
			section: 'A',
			academicYear: '2024-2025',
			semester: 'sem1',
			branch: 'Main Campus',
			classTeacher: 'teacher1',
			students: [],
			capacity: 30,
			currentStrength: 28,
			status: 'active',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tuitionFee: 500,
		},
		{
			id: 'cls2',
			name: 'Class 9-B',
			grade: '9',
			section: 'B',
			academicYear: '2024-2025',
			semester: 'sem1',
			branch: 'Main Campus',
			classTeacher: 'teacher2',
			students: [],
			capacity: 25,
			currentStrength: 22,
			status: 'active',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			tuitionFee: 450,
		},
	];
};

export const createClassAPI = async (data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class> => {
	console.log('Creating class:', data);
	await new Promise((resolve) => setTimeout(resolve, 500));
	const now = new Date().toISOString();
	return {
		...data,
		id: `cls-${Date.now()}`,
		createdAt: now,
		updatedAt: now,
	};
};

export const updateClassAPI = async (cls: Class): Promise<Class> => {
	console.log('Updating class:', cls);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return { ...cls, updatedAt: new Date().toISOString() };
};

export const deleteClassAPI = async (id: string): Promise<void> => {
	console.log('Deleting class:', id);
	await new Promise((resolve) => setTimeout(resolve, 500));
};
