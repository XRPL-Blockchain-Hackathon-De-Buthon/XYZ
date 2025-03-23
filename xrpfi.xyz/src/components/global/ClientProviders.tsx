'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalWalletModal from '@/components/wallet/GlobalWalletModal';

// 쿼리 클라이언트 인스턴스 생성
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true, // 모바일 환경에서 백그라운드에서 포어그라운드로 올라올 때 필요
			retry: false,
			// retryDelay: (attempt) => Math.min(1000 * 3 ** attempt, 30000),
		},
	},
});

/**
 * 클라이언트 측에서만 사용되는 모든 프로바이더를 한 곳에서 관리하는 컴포넌트
 * Next.js 서버 컴포넌트와 함께 사용하기 위해 'use client' 지시문을 사용
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<GlobalWalletModal />
		</QueryClientProvider>
	);
}
