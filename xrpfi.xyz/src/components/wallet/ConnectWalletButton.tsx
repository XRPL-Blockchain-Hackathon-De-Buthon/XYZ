import React from 'react';
import Button from '@/components/ui/Button';
import { useWalletStore } from '@/store/walletState';

interface ConnectWalletButtonProps {
	className?: string;
	label?: string;
	showMessage?: boolean;
}

export default function ConnectWalletButton({
	className = 'w-full',
	label = '지갑 연결하기',
	showMessage = true,
}: ConnectWalletButtonProps) {
	const { openWalletModal } = useWalletStore();

	return (
		<div className="text-center">
			{showMessage && <p className="text-gray-400 mb-4">지갑을 연결하여 서비스를 이용하세요.</p>}
			<Button onClick={openWalletModal} className={className}>
				{label}
			</Button>
		</div>
	);
}
