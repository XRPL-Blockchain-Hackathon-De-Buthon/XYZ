'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';
import IconButton from './IconButton';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastProps = {
	type: ToastType;
	message: string;
	duration?: number;
	onClose: () => void;
	isVisible: boolean;
};

export default function Toast({ type, message, duration = 3000, onClose, isVisible }: ToastProps) {
	const [isClosing, setIsClosing] = useState(false);

	// 자동으로 토스트 닫기
	useEffect(() => {
		if (isVisible && duration > 0) {
			const timer = setTimeout(() => {
				setIsClosing(true);
				setTimeout(onClose, 200);
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	// 토스트 닫기
	const handleClose = () => {
		setIsClosing(true);
		setTimeout(onClose, 200);
	};

	// 토스트 타입에 따른 아이콘 및 스타일
	const toastConfig = {
		success: {
			icon: CheckCircle,
			bgColor: 'bg-green-800/70',
			borderColor: 'border-green-500',
			textColor: 'text-green-300',
		},
		error: {
			icon: XCircle,
			bgColor: 'bg-red-800/70',
			borderColor: 'border-red-500',
			textColor: 'text-red-300',
		},
		warning: {
			icon: AlertCircle,
			bgColor: 'bg-yellow-800/70',
			borderColor: 'border-yellow-500',
			textColor: 'text-yellow-300',
		},
		info: {
			icon: Info,
			bgColor: 'bg-blue-800/70',
			borderColor: 'border-blue-500',
			textColor: 'text-blue-300',
		},
	};

	const { icon: Icon, bgColor, borderColor, textColor } = toastConfig[type];

	return (
		<div
			className={`flex items-center max-w-md p-3 ${bgColor} border ${borderColor} rounded-lg shadow-xl transition-all duration-200 ${
				isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
			}`}
		>
			<Icon className={`mr-2 ${textColor}`} size={18} />
			<span className="flex-1 mr-2 text-white font-medium">{message}</span>
			<IconButton icon={X} variant="outline" size="sm" onClick={handleClose} className="text-white hover:bg-white/10" />
		</div>
	);
}
