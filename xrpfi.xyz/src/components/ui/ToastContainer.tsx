'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Toast, { ToastType } from './Toast';

// 토스트 메시지 타입 정의
export type ToastMessage = {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
};

// 토스트 컨텍스트 타입 정의
type ToastContextType = {
	showToast: (type: ToastType, message: string, duration?: number) => void;
};

// 토스트 컨텍스트 생성
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 토스트 컨텍스트 훅
export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};

// 토스트 컨테이너 Props
type ToastContainerProps = {
	children: React.ReactNode;
};

export function ToastContainer({ children }: ToastContainerProps) {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	// 토스트 추가 함수
	const showToast = (type: ToastType, message: string, duration = 3000) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { id, type, message, duration }]);
	};

	// 토스트 제거 함수
	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						type={toast.type}
						message={toast.message}
						duration={toast.duration}
						onClose={() => removeToast(toast.id)}
						isVisible={true}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
}
