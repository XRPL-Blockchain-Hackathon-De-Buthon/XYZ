'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import IconButton from './IconButton';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
	const [isVisible, setIsVisible] = useState(false);

	// 오버레이 클릭시 모달 닫기
	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	// ESC 키로 모달 닫기
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener('keydown', handleEsc);
		}

		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, [isOpen, onClose]);

	// 애니메이션을 위한 상태 관리
	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
		} else {
			const timer = setTimeout(() => setIsVisible(false), 200);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!isVisible && !isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
	};

	return (
		<div
			className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 px-4 ${
				isOpen ? 'opacity-100' : 'opacity-0'
			}`}
			onClick={handleOverlayClick}
		>
			<div
				className={`${
					sizeClasses[size]
				} w-full bg-dark-card rounded-lg border border-dark-border shadow-xl transition-all duration-200 ${
					isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
				}`}
			>
				<div className="flex items-center justify-between border-b border-dark-border p-4">
					{title && <h3 className="text-lg font-semibold">{title}</h3>}
					<IconButton icon={X} variant="outline" size="sm" onClick={onClose} className="ml-auto" />
				</div>
				<div className="p-4">{children}</div>
			</div>
		</div>
	);
}
