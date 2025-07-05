import type { Subject } from '@/types/subject';

export const fetchSubjectsAPI = async (): Promise<Subject[]> => {
	console.log('Fetching subjects');
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return [
		{
			id: 1,
			name: 'Mathematics',
			code: 'MATH101',
			type: 'Core',
			bgColor: 'bg-blue-200',
			image: '/images/subjects/math.svg',
		},
		{
			id: 2,
			name: 'Science',
			code: 'SCI101',
			type: 'Core',
			bgColor: 'bg-green-200',
			image: '/images/subjects/science.svg',
		},
	];
};

export const createSubjectAPI = async (data: Omit<Subject, 'id'>): Promise<Subject> => {
	console.log('Creating subject:', data);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		...data,
		id: Date.now(),
	};
};

export const updateSubjectAPI = async (subject: Subject): Promise<Subject> => {
	console.log('Updating subject:', subject);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return subject;
};

export const deleteSubjectAPI = async (id: number): Promise<void> => {
	console.log('Deleting subject:', id);
	await new Promise((resolve) => setTimeout(resolve, 500));
};
