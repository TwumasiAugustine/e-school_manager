export const getDashboardPathForRole = (
	role?: string | undefined,
): string => {
	switch (role?.toLowerCase()) {
		case 'super_admin':
			return '/superAdmin/dashboard';
		case 'admin':
			return '/admin/dashboard';
		case 'staff':
			return '/staff/dashboard';
		case 'parent':
			return '/parent/dashboard';
		case 'student':
			return '/student/dashboard';
		default:
			// Fallback dashboard path, consistent with original Sidebar logic
			return '/superAdmin/dashboard'; 
	}
};
