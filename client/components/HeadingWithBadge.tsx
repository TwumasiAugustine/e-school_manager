import React from 'react';

interface HeadingWithBadgeProps {
	title: string;
	count?: number;
	badgeText?: string; // Added for flexibility, can be used instead of or with count
	level?: 'h1' | 'h2' | 'h3' | 'h4';
	className?: string;
	icon?: React.ElementType; // To accept an icon component
	iconColor?: string; // To style the icon
}

const HeadingWithBadge: React.FC<HeadingWithBadgeProps> = ({
	title,
	count,
	badgeText,
	level = 'h2',
	className = '',
	icon: IconComponent, // Destructure and rename to avoid conflict
	iconColor = 'text-gray-700', // Default icon color
}) => {
	const Tag = level;

	const baseClasses = {
		h1: 'text-2xl font-bold',
		h2: 'text-xl font-semibold',
		h3: 'text-lg font-semibold',
		h4: 'text-base font-medium',
	};

	return (
		<div className={`flex items-center ${className}`}>
			{IconComponent && (
				<IconComponent className={`mr-2 h-5 w-5 ${iconColor}`} />
			)}
			<Tag className={`${baseClasses[level]} text-gray-800`}>{title}</Tag>

			{(count !== undefined || badgeText) && (
				<span className='ml-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full'>
					{badgeText ? badgeText : count}
				</span>
			)}
		</div>
	);
};

export default HeadingWithBadge;
