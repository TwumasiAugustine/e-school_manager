import Link from 'next/link';

export default function NotFound() {
  return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-emerald-100'>
			<div className='bg-white p-8 rounded-lg shadow-md text-center border border-emerald-200'>
				<h1 className='text-4xl font-bold text-red-700 mb-4'>
					404
				</h1>
				<h2 className='text-2xl font-semibold text-red-600 mb-4'>
					Page Not Found
				</h2>
				<p className='text-red-500 mb-6'>
					Sorry, the page you are looking for does not exist.
				</p>
				<Link
					href='/'
					className='px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors'>
					Go back to Home
				</Link>
			</div>
		</div>
  );
}
