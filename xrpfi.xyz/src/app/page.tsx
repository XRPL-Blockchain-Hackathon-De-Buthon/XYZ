'use client';

import React from 'react';
import PageWrapper from '@/components/global/PageWrapper';
import WalletInfo from '@/components/wallet/WalletInfo';
import StakingSummary from '@/components/staking/StakingSummary';
import AssetChart from '@/components/staking/AssetChart';
import { useWalletStore } from '@/store/walletState';
import ConnectWalletCard from '@/components/wallet/ConnectWalletCard';

export default function Home() {
	const { wallet } = useWalletStore();
	const isWalletConnected = wallet.connected;

	return (
		<PageWrapper title="Dashboard">
			<div className="flex flex-col gap-6 w-full">
				{isWalletConnected ? (
					<>
						<StakingSummary />
						<WalletInfo />
						<AssetChart />
					</>
				) : (
					<ConnectWalletCard />
				)}
			</div>
		</PageWrapper>
	);
}
