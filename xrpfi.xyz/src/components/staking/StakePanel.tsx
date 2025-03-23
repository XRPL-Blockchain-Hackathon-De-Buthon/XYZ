import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { Info, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContainer';
import Modal from '@/components/ui/Modal';
import { useWalletStore } from '@/store/walletState';
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';
import { useBridgeXrplToEvmApi } from '@/api/staking';

// APR 연간 수익률 (관리자가 설정 가능한 값)
const APR = 5; // 5%

type TransactionStatus = 'idle' | 'confirming' | 'processing' | 'success' | 'error';

// 전역 xumm SDK 접근
declare global {
	interface Window {
		Xumm: any;
	}
}

export default function StakePanel() {
	const { wallet, refreshBalance } = useWallet();
	const { showToast } = useToast();
	const [amount, setAmount] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const [txStatus, setTxStatus] = useState<TransactionStatus>('idle');
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
	const [txError, setTxError] = useState<string | null>(null);
	const [txHash, setTxHash] = useState<string | null>(null);
	const { openWalletModal } = useWalletStore();
	const bridgeMutation = useBridgeXrplToEvmApi();
	const [requestId, setRequestId] = useState<string | null>(null);

	// 입력값 변경 핸들러
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setAmount(value);
		validateAmount(value);
	};

	// 금액 유효성 검증
	const validateAmount = (value: string) => {
		setError(null);

		if (!value || parseFloat(value) <= 0) {
			setError('0보다 큰 금액을 입력해주세요');
			return false;
		}

		const numValue = parseFloat(value);

		if (isNaN(numValue)) {
			setError('유효한 숫자를 입력해주세요');
			return false;
		}

		if (numValue < 1) {
			setError('최소 스테이킹 금액은 1 XRP입니다');
			return false;
		}

		if (wallet.balance && numValue > wallet.balance) {
			setError('보유 금액보다 큰 금액을 스테이킹할 수 없습니다');
			return false;
		}

		// XRP는 소수점 6자리까지만 허용
		if (value.includes('.') && value.split('.')[1].length > 6) {
			setError('XRP는 소수점 6자리까지만 입력 가능합니다');
			return false;
		}

		return true;
	};

	// 예상 일일 보상 계산
	const calculateDailyReward = () => {
		if (!amount || isNaN(parseFloat(amount))) return 0;

		const stakeAmount = parseFloat(amount);
		const annualReward = stakeAmount * (APR / 100);
		const dailyReward = annualReward / 365;

		return dailyReward.toFixed(4);
	};

	// 스테이킹 실행
	const executeStaking = async () => {
		if (!validateAmount(amount)) return;

		// 거래 모달 열기
		setTxStatus('confirming');
		setIsStatusModalOpen(true);
		setTxError(null);
		setTxHash(null);
		setRequestId(null);
	};

	// 스테이킹 확인 후 실행
	const confirmStaking = async () => {
		if (!wallet.address) {
			setTxStatus('error');
			setTxError('지갑 주소 정보를 찾을 수 없습니다.');
			return;
		}

		try {
			setTxStatus('processing');

			const stakeAmount = parseFloat(amount);

			// Xaman SDK 확인
			if (typeof window !== 'undefined' && window.Xumm && wallet.type === 'xaman') {
				// XRPL to EVM 브릿지 요청 - Xaman을 통한 서명 방식
				const response = await bridgeMutation.mutateAsync({
					amount: String(stakeAmount),
					sourceAddress: wallet.address,
					destinationAddress: '0xFE8d94b2605EE277b74aFdF1C8820eb3287388d3',
					// sourceSeed 대신 서명 요청을 통해 처리
					autoSwap: true,
				});

				// 응답 처리
				if (response.data.success && response.data.data) {
					const responseData = response.data.data;
					setRequestId(responseData.requestId);
					setTxStatus('success');
					showToast('success', `${amount} XRP 스테이킹이 성공적으로 요청되었습니다`);

					// 잔액 새로고침
					await refreshBalance();
				} else {
					setTxStatus('error');
					setTxError('브릿지 요청이 실패했습니다.');
					showToast('error', '스테이킹 처리 중 오류가 발생했습니다');
				}
			} else {
				// Xaman SDK가 없거나 다른 지갑 타입인 경우 (개발/테스트 모드)
				setTxStatus('error');
				setTxError('Xaman 지갑이 연결되어 있지 않습니다. Xaman 지갑을 통해 스테이킹해주세요.');
				showToast('error', 'Xaman 지갑이 필요합니다');
			}
		} catch (error) {
			console.error('스테이킹 오류:', error);
			setTxStatus('error');
			setTxError('스테이킹 요청 중 오류가 발생했습니다');
			showToast('error', '스테이킹 처리 중 오류가 발생했습니다');
		}
	};

	// 거래 상태 모달 닫기
	const handleCloseStatusModal = () => {
		// 성공 상태에서만 입력값 초기화
		if (txStatus === 'success') {
			setAmount('');
		}

		setIsStatusModalOpen(false);
		setTxStatus('idle');
	};

	const renderContent = () => {
		if (!wallet.connected) {
			return (
				<div className="py-6">
					<ConnectWalletButton label="지갑 연결하기" />
				</div>
			);
		}

		return (
			<>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						스테이킹 수량 (XRP)
						{wallet.connected && (
							<span className="text-xs text-gray-400 ml-2">보유량: {wallet.balance.toFixed(2)} XRP</span>
						)}
					</label>
					<input
						type="number"
						className={`w-full px-3 py-2 bg-dark-background border ${
							error ? 'border-red-500' : 'border-dark-border'
						} rounded-md focus:outline-none focus:ring-1 focus:ring-neon-purple`}
						placeholder="0.0"
						value={amount}
						onChange={handleAmountChange}
						min="10"
						max={wallet.balance || undefined}
						step="0.000001"
					/>
					{error && (
						<p className="text-red-500 text-xs mt-1 flex items-center">
							<AlertCircle className="h-3 w-3 mr-1" />
							{error}
						</p>
					)}
				</div>

				<div className="p-3 bg-dark-background/40 rounded-md mb-4">
					<p className="text-sm font-medium">
						예상 일일 보상: <span className="text-neon-green">{calculateDailyReward()} RLUSD</span>
					</p>
					<p className="text-sm font-medium">
						예상 연간 수익률: <span className="text-neon-green">{APR.toFixed(2)}%</span>
					</p>
				</div>

				<div className="mb-4 p-3 bg-dark-background/30 rounded-md flex items-start space-x-2">
					<Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
					<div className="text-xs text-gray-400">
						<p className="mb-1">스테이킹한 XRP는 해당 기간 동안 락업됩니다.</p>
						<p className="mb-1">최소 스테이킹 금액은 1 XRP입니다.</p>
						<p>보상은 매일 RLUSD 형태로 지급됩니다.</p>
					</div>
				</div>

				<Button className="w-full" onClick={executeStaking} disabled={!amount || !!error || parseFloat(amount) <= 0}>
					스테이킹 실행
				</Button>
			</>
		);
	};

	return (
		<>
			<Card className="max-w-[768px] mx-auto">
				<h2 className="text-xl font-semibold mb-4">스테이킹 입력</h2>
				{renderContent()}
			</Card>

			{/* 트랜잭션 상태 모달 */}
			<Modal
				isOpen={isStatusModalOpen}
				onClose={txStatus !== 'confirming' && txStatus !== 'processing' ? handleCloseStatusModal : () => {}}
				title="스테이킹 요청"
				size="sm"
			>
				<div className="space-y-4 text-center py-2">
					{txStatus === 'confirming' && (
						<>
							<div className="flex flex-col items-center space-y-3 py-4">
								<Info className="h-10 w-10 text-neon-blue" />
								<p className="font-medium">스테이킹 요청을 확인해주세요</p>
								<p className="text-sm text-gray-400">
									{amount} XRP를 스테이킹하고 {calculateDailyReward()} RLUSD의 일일 보상을 받습니다
								</p>
							</div>
							<div className="flex space-x-3">
								<Button variant="outline" className="flex-1" onClick={handleCloseStatusModal}>
									취소
								</Button>
								<Button className="flex-1" onClick={confirmStaking}>
									확인
								</Button>
							</div>
						</>
					)}

					{txStatus === 'processing' && (
						<div className="flex flex-col items-center space-y-3 py-4">
							<Loader className="h-10 w-10 text-neon-blue animate-spin" />
							<p className="font-medium">트랜잭션 처리 중</p>
							<p className="text-sm text-gray-400">
								XRPL 네트워크에서 트랜잭션이 처리되고 있습니다. 잠시만 기다려주세요...
							</p>
						</div>
					)}

					{txStatus === 'success' && (
						<>
							<div className="flex flex-col items-center space-y-3 py-4">
								<CheckCircle className="h-10 w-10 text-neon-green" />
								<p className="font-medium">스테이킹 성공!</p>
								<p className="text-sm text-gray-400">{amount} XRP가 성공적으로 스테이킹 요청되었습니다</p>
								{requestId && (
									<div className="w-full">
										<p className="text-xs text-gray-400 mb-1">요청 ID:</p>
										<p className="text-xs font-mono bg-dark-background p-2 rounded-md overflow-x-auto">{requestId}</p>
									</div>
								)}
							</div>
							<Button className="w-full" onClick={handleCloseStatusModal}>
								확인
							</Button>
						</>
					)}

					{txStatus === 'error' && (
						<>
							<div className="flex flex-col items-center space-y-3 py-4">
								<AlertCircle className="h-10 w-10 text-red-500" />
								<p className="font-medium">스테이킹 실패</p>
								<p className="text-sm text-gray-400">{txError || '트랜잭션 처리 중 오류가 발생했습니다'}</p>
							</div>
							<Button className="w-full" onClick={handleCloseStatusModal}>
								확인
							</Button>
						</>
					)}
				</div>
			</Modal>
		</>
	);
}
