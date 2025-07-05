export interface Section {
	id: string;
	name: string;
	trashed?: boolean;
}

export const fetchSectionsAPI = async (): Promise<Section[]> => {
	console.log('Fetching sections');
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return [
		{ id: 'sec1', name: 'A' },
		{ id: 'sec2', name: 'B' },
		{ id: 'sec3', name: 'C' },
	];
};

export const createSectionAPI = async (data: Omit<Section, 'id'>): Promise<Section> => {
	console.log('Creating section:', data);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		...data,
		id: `sec-${Date.now()}`,
	};
};

export const updateSectionAPI = async (section: Section): Promise<Section> => {
	console.log('Updating section:', section);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return section;
};

export const deleteSectionAPI = async (id: string): Promise<void> => {
	console.log('Deleting section:', id);
	await new Promise((resolve) => setTimeout(resolve, 500));
};
