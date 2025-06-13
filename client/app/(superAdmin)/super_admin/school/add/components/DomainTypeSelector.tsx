import React from 'react';

interface DomainTypeSelectorProps {
	value: string;
	onChange: (value: string) => void;
}

const DomainTypeSelector: React.FC<DomainTypeSelectorProps> = ({
	value,
	onChange,
}) => (
	<div className='flex gap-6 items-center mt-2'>
		<label className='flex items-center gap-2'>
			<input
				type='radio'
				name='domainType'
				value='default'
				checked={value === 'default'}
				onChange={() => onChange('default')}
			/>
			<span>Default</span>
		</label>
		<label className='flex items-center gap-2'>
			<input
				type='radio'
				name='domainType'
				value='custom'
				checked={value === 'custom'}
				onChange={() => onChange('custom')}
			/>
			<span>Custom</span>
		</label>
	</div>
);

export default DomainTypeSelector;
