import React from 'react';
import Image from 'next/image';
interface WelcomeBannerProps {
	userName?: string;
	isVerified?: boolean;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
	userName = 'Admin',
	isVerified = false,
}) => {
	return (
		<div className='bg-red-50 rounded-lg p-4 shadow-sm flex items-center justify-between'>
			<div>
				<h2 className='text-red-400 text-xl font-medium mb-1'>
					Welcome to {userName} Dashboard
				</h2>
				{!isVerified && (
					<p className='text-gray-600'>
						Your Account is not Verified yet!
						<br />
						Please Verify your email address.{' '}
						<a
							href='#'
							className='text-blue-500 hover:underline'>
							Verify now!
						</a>
					</p>
				)}
			</div>
			<div className='hidden sm:block'>
				<Image
                    src='/placeholder-avatar.png'
                    width={80}
                    height={80}
					alt='Admin user'
					className='h-24 w-auto'
				/>
			</div>
		</div>
	);
};

export default WelcomeBanner;
