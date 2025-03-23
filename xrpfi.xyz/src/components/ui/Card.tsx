'use client';

import React from 'react';

type CardProps = {
	children: React.ReactNode;
	className?: string;
	title?: string;
};

export const Card = ({ children, className = '', title }: CardProps) => {
	return (
		<div className={`bg-dark-card rounded-lg border border-dark-border p-4 shadow-lg ${className}`}>
			{title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
			{children}
		</div>
	);
};

export default Card;
