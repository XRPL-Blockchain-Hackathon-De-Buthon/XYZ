'use client';

import React from 'react';

type ButtonProps = {
	variant?: 'primary' | 'secondary' | 'outline';
	size?: 'sm' | 'md' | 'lg';
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
	variant = 'primary',
	size = 'md',
	children,
	onClick,
	className = '',
	disabled = false,
	...props
}: ButtonProps) => {
	const baseStyles =
		'rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center cursor-pointer';

	const variantStyles = {
		primary: 'bg-neon-purple hover:bg-neon-purple/80 text-black',
		secondary: 'bg-dark-card hover:bg-dark-border text-white',
		outline: 'bg-transparent border border-dark-border hover:bg-dark-card text-white',
	};

	const sizeStyles = {
		sm: 'px-2 py-1 text-sm',
		md: 'px-4 py-2',
		lg: 'px-6 py-3 text-lg',
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
