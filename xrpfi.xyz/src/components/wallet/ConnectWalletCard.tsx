import React from 'react';
import Card from '@/components/ui/Card';
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';
import { Wallet } from 'lucide-react';

const ConnectWalletCard: React.FC = () => {
	return (
		<Card title="지갑 연결 필요" className="w-full">
			<div className="py-8 flex flex-col items-center">
				<Wallet className="w-16 h-16 text-neon-blue mb-4" />
				<h2 className="text-xl font-semibold mb-4">지갑을 연결하여 시작하세요</h2>
				<p className="text-gray-400 mb-6 text-center max-w-md">
					지갑을 연결하면 스테이킹 정보, 자산 현황 및 지갑 정보를 확인할 수 있습니다.
					<br />
					지갑 연결은 간단하고 안전합니다.
				</p>
				<div className="w-full px-4 sm:px-8 md:px-16">
					<ConnectWalletButton label="지갑 연결하기" className="w-full" showMessage={false} />
				</div>
			</div>
		</Card>
	);
};

export default ConnectWalletCard;
