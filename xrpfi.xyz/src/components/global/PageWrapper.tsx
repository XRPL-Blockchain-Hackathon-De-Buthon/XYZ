'use client';

import React, { ReactNode } from 'react';

interface PageWrapperProps {
	title: string;
	children: ReactNode;
}

export default function PageWrapper({ title, children }: PageWrapperProps) {
	return (
		<main className="max-w-[768px] w-full mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">{title}</h1>
			{children}
		</main>
	);
}
