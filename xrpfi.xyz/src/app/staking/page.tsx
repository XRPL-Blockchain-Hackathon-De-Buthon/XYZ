'use client';

import React, { Suspense } from 'react';
import PageWrapper from '@/components/global/PageWrapper';
import StakingTabs from '@/components/staking/StakingTabs';
import { useSearchParams } from 'next/navigation';

// 탭 파라미터를 처리하는 클라이언트 컴포넌트
function StakingContent() {
	const searchParams = useSearchParams();
	const tab = searchParams.get('tab') as 'stake' | 'withdraw' | null;

	return <StakingTabs defaultTab={tab || 'stake'} />;
}

export default function StakingPage() {
	return (
		<PageWrapper title="XRP 스테이킹 관리">
			<Suspense fallback={<StakingTabs defaultTab="stake" />}>
				<StakingContent />
			</Suspense>
		</PageWrapper>
	);
}
