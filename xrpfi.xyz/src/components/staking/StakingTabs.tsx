import React, { useState } from 'react';
import StakePanel from './StakePanel';
import WithdrawPanel from './WithdrawPanel';
import { PlusCircle, MinusCircle } from 'lucide-react';

type Tab = 'stake' | 'withdraw';

interface StakingTabsProps {
	defaultTab?: Tab;
}

export default function StakingTabs({ defaultTab = 'stake' }: StakingTabsProps) {
	const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

	return (
		<div className="w-full max-w-[768px] mx-auto">
			{/* 탭 메뉴 */}
			<div className="flex mb-6 bg-dark-background/50 rounded-lg p-1">
				<button
					className={`flex items-center justify-center w-1/2 py-2 rounded-md transition-all cursor-pointer duration-200 ${
						activeTab === 'stake' ? 'bg-neon-purple text-white' : 'text-gray-400 hover:text-gray-200'
					}`}
					onClick={() => setActiveTab('stake')}
				>
					<PlusCircle className="h-4 w-4 mr-1.5" />
					<span>스테이킹</span>
				</button>
				<button
					className={`flex items-center justify-center w-1/2 py-2 rounded-md transition-all cursor-pointer duration-200 ${
						activeTab === 'withdraw' ? 'bg-neon-purple text-white' : 'text-gray-400 hover:text-gray-200'
					}`}
					onClick={() => setActiveTab('withdraw')}
				>
					<MinusCircle className="h-4 w-4 mr-1.5" />
					<span>해지</span>
				</button>
			</div>

			{/* 탭 컨텐츠 */}
			<div className="transition-all duration-300">{activeTab === 'stake' ? <StakePanel /> : <WithdrawPanel />}</div>
		</div>
	);
}
