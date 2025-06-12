import Image from 'next/image';

const Loader = () => {
	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-300 animate-fade-in-up'>
			<div className='flex flex-col items-center p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-100'>
				<div className='relative mb-8'>
					<div className='absolute inset-0 rounded-full bg-emerald-200/50 animate-pulse'></div>
					<div className='relative animate-pulse-slow'>
						<Image
							src='/globe.svg'
							alt='School Logo'
							width={100}
							height={100}
							className='z-10 relative'
						/>
					</div>
				</div>
				
				<h1 className='text-3xl md:text-4xl font-bold text-emerald-700 mb-3 tracking-wide animate-fade-in-up'>
					eSchool Management
				</h1>
				
				<p className='text-emerald-500 mb-8 animate-fade-in-up delay-100'>
					Loading your experience...
				</p>
				
				<div className='flex items-center space-x-2'>
					<div className='w-3 h-3 rounded-full bg-emerald-400 animate-bounce'></div>
					<div className='w-3 h-3 rounded-full bg-emerald-500 animate-bounce delay-100'></div>
					<div className='w-3 h-3 rounded-full bg-emerald-600 animate-bounce delay-200'></div>
					<div className='w-3 h-3 rounded-full bg-emerald-700 animate-bounce delay-300'></div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
