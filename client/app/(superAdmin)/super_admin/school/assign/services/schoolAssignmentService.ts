// Service for school-admin assignment management (mock implementation)
export interface School {
	id: string;
	name: string;
	address?: string;
}

export interface Admin {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
}

export interface SchoolAssignment {
	schoolId: string;
	adminId: string;
	assignedAt: string;
}

const mockSchools: School[] = [
	{ id: 'school1', name: 'Green Valley School', address: '123 Main St' },
	{ id: 'school2', name: 'Blue Ridge Academy', address: '456 Oak Ave' },
	{ id: 'school3', name: 'Sunrise High', address: '789 Pine Rd' },
];

const mockAdmins: Admin[] = [
	{ id: 'admin1', name: 'Alice Johnson', email: 'alice@school.com' },
	{ id: 'admin2', name: 'Bob Smith', email: 'bob@school.com' },
	{ id: 'admin3', name: 'Charlie Lee', email: 'charlie@school.com' },
];

let mockAssignments: SchoolAssignment[] = [
	{
		schoolId: 'school1',
		adminId: 'admin1',
		assignedAt: new Date().toISOString(),
	},
	{
		schoolId: 'school2',
		adminId: 'admin2',
		assignedAt: new Date().toISOString(),
	},
];

export async function fetchSchoolsWithAdmins(): Promise<
	{
		school: School;
		admin: Admin | null;
		assignedAt?: string;
	}[]
> {
	// Simulate API delay
	await new Promise((r) => setTimeout(r, 300));
	return mockSchools.map((school) => {
		const assignment = mockAssignments.find(
			(a) => a.schoolId === school.id,
		);
		const admin = assignment
			? mockAdmins.find((ad) => ad.id === assignment.adminId) || null
			: null;
		return {
			school,
			admin,
			assignedAt: assignment?.assignedAt,
		};
	});
}

export async function fetchAvailableAdmins(): Promise<Admin[]> {
	await new Promise((r) => setTimeout(r, 200));
	// Only admins not currently assigned
	const assignedAdminIds = new Set(mockAssignments.map((a) => a.adminId));
	return mockAdmins.filter((a) => !assignedAdminIds.has(a.id));
}

export async function assignSchoolToAdmin(
	schoolId: string,
	adminId: string,
): Promise<void> {
	await new Promise((r) => setTimeout(r, 200));
	// Remove any previous assignment for this school
	mockAssignments = mockAssignments.filter((a) => a.schoolId !== schoolId);
	mockAssignments.push({
		schoolId,
		adminId,
		assignedAt: new Date().toISOString(),
	});
}

export async function unassignSchoolFromAdmin(schoolId: string): Promise<void> {
	await new Promise((r) => setTimeout(r, 200));
	mockAssignments = mockAssignments.filter((a) => a.schoolId !== schoolId);
}
