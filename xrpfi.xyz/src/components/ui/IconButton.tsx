'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

type IconButtonProps = {
	icon: LucideIcon;
	variant?: 'primary' | 'secondary' | 'outline';
	size?: 'sm' | 'md' | 'lg';
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
};

export const IconButton = ({
	icon: Icon,
	variant = 'primary',
	size = 'md',
	onClick,
	className = '',
	disabled = false,
}: IconButtonProps) => {
	const baseStyles = 'rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer';

	const variantStyles = {
		primary: 'bg-neon-purple hover:bg-neon-purple/80 text-black',
		secondary: 'bg-dark-card hover:bg-dark-border text-white',
		outline: 'bg-transparent border border-dark-border hover:bg-dark-card text-white',
	};

	const sizeStyles = {
		sm: 'p-1',
		md: 'p-2',
		lg: 'p-3',
	};

	const iconSizes = {
		sm: 16,
		md: 20,
		lg: 24,
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			<Icon size={iconSizes[size]} />
		</button>
	);
};

export default IconButton;
