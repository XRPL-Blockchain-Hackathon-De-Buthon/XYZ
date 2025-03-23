'use client';

import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { ExternalLink, Copy, RefreshCw, AlertCircle, CircleDollarSign, Check, Loader2 } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/ToastContainer';

export default function WalletInfo() {
	const { wallet, refreshBalance, getAddressDisplay, requestTestnetXRP } = useWallet();
	const { showToast } = useToast();
	const addressDisplay = getAddressDisplay();
	const [isRequestingXRP, setIsRequestingXRP] = useState(false);
	const [requestError, setRequestError] = useState<string | null>(null);
	const [isCopied, setIsCopied] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	// 주소 복사 함수
	const copyAddress = async () => {
		if (!wallet.address) return;

		try {
			await navigator.clipboard.writeText(wallet.address);
			setIsCopied(true);
			showToast('success', '주소가 클립보드에 복사되었습니다');

			// 2초 후 상태 초기화
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		} catch (error) {
			console.error('클립보드 복사 실패:', error);
			showToast('error', '주소 복사에 실패했습니다');

			// fallback: 클립보드 API가 지원되지 않는 환경
			const textArea = document.createElement('textarea');
			textArea.value = wallet.address;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			try {
				document.execCommand('copy');
				setIsCopied(true);
				showToast('success', '주소가 클립보드에 복사되었습니다');

				setTimeout(() => {
					setIsCopied(false);
				}, 2000);
			} catch (e) {
				console.error('대체 복사 방법 실패:', e);
				showToast('error', '주소 복사에 실패했습니다');
			}

			document.body.removeChild(textArea);
		}
	};

	// 블록 익스플로러에서 주소 보기
	const viewOnExplorer = () => {
		window.open(`https://testnet.xrpl.org/accounts/${wallet.address}`, '_blank');
	};

	// 잔액 새로고침 함수
	const handleRefreshBalance = async () => {
		if (isRefreshing) return;

		setIsRefreshing(true);

		try {
			await refreshBalance();
			showToast('info', '잔액이 업데이트되었습니다');
		} catch (error) {
			console.error('잔액 새로고침 실패:', error);
			showToast('error', '잔액 업데이트에 실패했습니다');
		} finally {
			setIsRefreshing(false);
		}
	};

	// 테스트넷 XRP 요청 함수
	const handleRequestTestnetXRP = async () => {
		if (!requestTestnetXRP) return;

		setIsRequestingXRP(true);
		setRequestError(null);

		try {
			const success = await requestTestnetXRP();

			if (success) {
				showToast('success', '테스트넷 XRP를 요청했습니다. 잠시 후 잔액을 확인해 보세요.');

				// 3초 후 잔액 새로고침
				setTimeout(() => {
					refreshBalance();
				}, 3000);
			} else {
				setRequestError('테스트넷 XRP 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
			}
		} catch (error) {
			console.error('테스트넷 XRP 요청 오류:', error);
			setRequestError('테스트넷 XRP 요청 중 오류가 발생했습니다.');
		} finally {
			setIsRequestingXRP(false);
		}
	};

	// 테스트넷 계정 활성화 필요 또는 잔액이 0인 경우
	const needsTestnetXRP = wallet.balance === 0;

	return (
		<Card title="지갑 정보" className="w-full">
			<div className="p-3 bg-dark-card rounded-lg border border-dark-border">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center overflow-hidden">
						<span className="text-sm font-medium mr-1 flex-shrink-0">지갑 주소:</span>
						<span className="text-sm font-mono truncate">{addressDisplay}</span>
					</div>
					<div className="flex space-x-1 flex-shrink-0">
						<IconButton
							icon={isCopied ? Check : Copy}
							size="sm"
							variant="outline"
							onClick={copyAddress}
							className={`cursor-pointer ${isCopied ? 'text-green-500 border-green-500' : ''}`}
						/>
						<IconButton
							icon={ExternalLink}
							size="sm"
							variant="outline"
							onClick={viewOnExplorer}
							className="cursor-pointer"
						/>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<span className="text-sm font-medium mr-1">잔액:</span>
						<span className={`${needsTestnetXRP ? 'text-yellow-400' : 'text-neon-green'}`}>
							{wallet.balance.toFixed(2)} XRP
						</span>
					</div>
					<div className="flex space-x-1">
						<IconButton
							icon={RefreshCw}
							size="sm"
							variant="outline"
							onClick={handleRefreshBalance}
							disabled={isRefreshing}
							className={`cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
						/>
					</div>
				</div>

				{needsTestnetXRP && (
					<div className="flex flex-col space-y-2 mt-4">
						{requestError && (
							<div className="flex items-center text-red-500 text-sm mb-2">
								<AlertCircle className="w-4 h-4 mr-1" />
								<span>{requestError}</span>
							</div>
						)}

						<Button
							onClick={handleRequestTestnetXRP}
							disabled={isRequestingXRP}
							className="w-full cursor-pointer"
							variant="secondary"
						>
							{isRequestingXRP ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									요청 중...
								</>
							) : (
								<>
									<CircleDollarSign className="mr-2 h-4 w-4" />
									테스트넷 XRP 요청하기
								</>
							)}
						</Button>

						<p className="text-xs text-muted-foreground mt-1">
							테스트넷 XRP를 요청하면 새 창이 열립니다. 창에서 &quot;Create Account&quot; 버튼을 클릭하세요.
						</p>
					</div>
				)}

				{/* 복사 시 알림 - 화면에 시각적 피드백 제공 */}
				{isCopied && (
					<div className="absolute top-0 right-0 bg-green-800/70 text-green-100 text-xs px-2 py-1 rounded m-2">
						주소가 복사되었습니다!
					</div>
				)}
			</div>
		</Card>
	);
}
