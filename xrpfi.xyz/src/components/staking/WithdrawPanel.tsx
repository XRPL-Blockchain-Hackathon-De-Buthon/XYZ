import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';
import { useStakingStore } from '@/store/stakingState';
import { useWalletStore } from '@/store/walletState';
import { Info, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContainer';
import Modal from '@/components/ui/Modal';
import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';

type TransactionStatus = 'idle' | 'confirming' | 'processing' | 'success' | 'error';

export default function WithdrawPanel() {
	const { wallet, refreshBalance } = useWallet();
	const { stakingInfo, setStakingInfo, isLoading, setIsLoading } = useStakingStore();
	const { openWalletModal } = useWalletStore();
	const { showToast } = useToast();

	const [amount, setAmount] = useState<string>('');
	const [sliderValue, setSliderValue] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);
	const [txStatus, setTxStatus] = useState<TransactionStatus>('idle');
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
	const [txError, setTxError] = useState<string | null>(null);
	const [txHash, setTxHash] = useState<string | null>(null);

	// 지갑 연결 시 스테이킹 데이터 로드
	useEffect(() => {
		if (wallet.connected && wallet.address) {
			loadStakingData(wallet.address);
		}
	}, [wallet.connected, wallet.address]);

	// 스테이킹 데이터 불러오기 (실제 구현 시에는 API 호출로 변경)
	const loadStakingData = async (address: string) => {
		try {
			setIsLoading(true);

			// API 호출 시뮬레이션 (실제로는 서버 API 호출 필요)
			setTimeout(() => {
				// 테스트 데이터
				const mockData = {
					walletAddress: address,
					stakedAmount: 50, // 500 XRP 스테이킹됨
					earnedReward: 25.8, // 25.8 RLUSD 보상 누적
				};

				setStakingInfo(mockData);
				setIsLoading(false);
			}, 1000);
		} catch (error) {
			console.error('스테이킹 데이터 로드 오류:', error);
			setIsLoading(false);
		}
	};

	// 입력값 변경 핸들러 (직접 입력)
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setAmount(value);

		// 슬라이더 값도 동기화
		if (value && !isNaN(parseFloat(value)) && stakingInfo.stakedAmount > 0) {
			const percent = Math.min(100, Math.max(0, (parseFloat(value) / stakingInfo.stakedAmount) * 100));
			setSliderValue(percent);
		} else {
			setSliderValue(0);
		}

		validateAmount(value);
	};

	// 슬라이더 값 변경 핸들러
	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		setSliderValue(value);

		// 계산된 XRP 값
		const calculatedAmount = (stakingInfo.stakedAmount * (value / 100)).toFixed(6);
		setAmount(calculatedAmount);
		validateAmount(calculatedAmount);
	};

	// 최대 금액 설정
	const setMaxAmount = () => {
		const maxAmount = stakingInfo.stakedAmount.toFixed(6);
		setAmount(maxAmount);
		setSliderValue(100);
		validateAmount(maxAmount);
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
			setError('최소 해지 금액은 1 XRP입니다');
			return false;
		}

		if (numValue > stakingInfo.stakedAmount) {
			setError('스테이킹된 금액보다 많이 해지할 수 없습니다');
			return false;
		}

		// XRP는 소수점 6자리까지만 허용
		if (value.includes('.') && value.split('.')[1].length > 6) {
			setError('XRP는 소수점 6자리까지만 입력 가능합니다');
			return false;
		}

		return true;
	};

	// 해지 실행
	const executeWithdraw = async () => {
		if (!validateAmount(amount)) return;

		// 거래 모달 열기
		setTxStatus('confirming');
		setIsStatusModalOpen(true);
		setTxError(null);
		setTxHash(null);

		try {
			// 유저 확인 후 거래 진행
			setTimeout(() => {
				// 실제 구현에서는 XRPL SDK를 통한 트랜잭션 생성과 서명 로직이 필요합니다
				setTxStatus('processing');

				// 트랜잭션 처리 시뮬레이션 (5초)
				setTimeout(async () => {
					try {
						// 성공 시나리오 (90% 확률)
						if (Math.random() > 0.1) {
							setTxStatus('success');
							setTxHash('DEMO' + Math.random().toString(36).substring(2, 12).toUpperCase());

							// 스테이킹 금액 업데이트
							const newStakedAmount = stakingInfo.stakedAmount - parseFloat(amount);
							setStakingInfo({ ...stakingInfo, stakedAmount: newStakedAmount });

							// 잔액 새로고침
							await refreshBalance();
							showToast('success', `${amount} XRP 해지가 성공적으로 처리되었습니다`);
						} else {
							// 실패 시나리오 (10% 확률)
							setTxStatus('error');
							setTxError('네트워크 혼잡으로 트랜잭션이 실패했습니다. 다시 시도해주세요.');
							showToast('error', '해지 처리 중 오류가 발생했습니다');
						}
					} catch (error) {
						setTxStatus('error');
						setTxError('트랜잭션 처리 중 오류가 발생했습니다');
						showToast('error', '해지 처리 중 오류가 발생했습니다');
					}
				}, 5000);
			}, 2000);
		} catch (error) {
			console.error('해지 오류:', error);
			setTxStatus('error');
			setTxError('해지 요청 중 오류가 발생했습니다');
		}
	};

	// 거래 상태 모달 닫기
	const handleCloseStatusModal = () => {
		// 성공 상태에서만 입력값 초기화
		if (txStatus === 'success') {
			setAmount('');
			setSliderValue(0);
		}

		setIsStatusModalOpen(false);
		setTxStatus('idle');
	};

	// 스테이킹 없을 때 표시할 내용
	const renderNoStaking = () => (
		<div className="text-center py-6">
			<p className="text-gray-400 mb-2">스테이킹된 XRP가 없습니다</p>
			<Button className="mt-2" onClick={() => (window.location.href = '/stake')}>
				스테이킹 하러 가기
			</Button>
		</div>
	);

	// 로딩 중일 때 표시할 내용
	const renderLoading = () => (
		<div className="text-center py-8">
			<Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-neon-purple" />
			<p className="text-gray-400">스테이킹 정보를 불러오는 중...</p>
		</div>
	);

	// 지갑 미연결 시 표시할 내용
	const renderNotConnected = () => (
		<div className="py-6">
			<ConnectWalletButton label="지갑 연결하기" />
		</div>
	);

	// 해지 입력 UI
	const renderWithdrawForm = () => (
		<>
			<div className="p-3 bg-dark-background/40 rounded-md mb-4">
				<p className="text-sm font-medium">
					현재 스테이킹: <span className="text-white">{stakingInfo.stakedAmount.toFixed(2)} XRP</span>
				</p>
				<p className="text-sm font-medium">
					누적 보상: <span className="text-neon-green">{stakingInfo.earnedReward.toFixed(4)} RLUSD</span>
				</p>
			</div>

			<div className="mb-4">
				<div className="flex justify-between mb-1">
					<label className="block text-sm font-medium">해지 수량 (XRP)</label>
					<button className="text-xs text-neon-blue hover:text-neon-purple" onClick={setMaxAmount}>
						최대 금액
					</button>
				</div>

				<input
					type="number"
					className={`w-full px-3 py-2 bg-dark-background border ${
						error ? 'border-red-500' : 'border-dark-border'
					} rounded-md focus:outline-none focus:ring-1 focus:ring-neon-purple mb-2`}
					placeholder="0.0"
					value={amount}
					onChange={handleAmountChange}
					min="1"
					max={stakingInfo.stakedAmount}
					step="0.000001"
				/>

				<div className="flex items-center justify-between text-xs text-gray-400 mb-2">
					<span>0 XRP</span>
					<span>{stakingInfo.stakedAmount.toFixed(2)} XRP</span>
				</div>

				<input
					type="range"
					className="w-full h-2 bg-dark-background rounded-lg appearance-none cursor-pointer accent-neon-purple"
					min="0"
					max="100"
					value={sliderValue}
					onChange={handleSliderChange}
				/>

				{error && (
					<p className="text-red-500 text-xs mt-2 flex items-center">
						<AlertCircle className="h-3 w-3 mr-1" />
						{error}
					</p>
				)}
			</div>

			<div className="mb-4 p-3 bg-dark-background/30 rounded-md flex items-start space-x-2">
				<Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
				<div className="text-xs text-gray-400">
					<p className="mb-1">해지된 XRP는 지갑으로 반환되기까지 약 24시간이 소요됩니다.</p>
					<p>해지 시 트랜잭션 비용(네트워크 수수료)이 발생할 수 있습니다.</p>
				</div>
			</div>

			<Button className="w-full" onClick={executeWithdraw} disabled={!amount || !!error || parseFloat(amount) <= 0}>
				해지 실행
			</Button>
		</>
	);

	return (
		<>
			<Card className="max-w-[768px] mx-auto">
				<h2 className="text-xl font-semibold mb-4">스테이킹 해지</h2>

				{!wallet.connected
					? renderNotConnected()
					: isLoading
					? renderLoading()
					: stakingInfo.stakedAmount <= 0
					? renderNoStaking()
					: renderWithdrawForm()}
			</Card>

			{/* 트랜잭션 상태 모달 */}
			<Modal
				isOpen={isStatusModalOpen}
				onClose={txStatus !== 'confirming' && txStatus !== 'processing' ? handleCloseStatusModal : () => {}}
				title="스테이킹 해지 요청"
				size="sm"
			>
				<div className="space-y-4 text-center py-2">
					{txStatus === 'confirming' && (
						<>
							<div className="flex flex-col items-center space-y-3 py-4">
								<Info className="h-10 w-10 text-neon-blue" />
								<p className="font-medium">해지 요청을 확인해주세요</p>
								<p className="text-sm text-gray-400">{amount} XRP를 스테이킹에서 해지합니다</p>
							</div>
							<div className="flex space-x-3">
								<Button variant="outline" className="flex-1" onClick={handleCloseStatusModal}>
									취소
								</Button>
								<Button className="flex-1" onClick={() => setTxStatus('processing')}>
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
								<p className="font-medium">해지 요청 성공!</p>
								<p className="text-sm text-gray-400">
									{amount} XRP의 해지 요청이 성공적으로 처리되었습니다.
									<br />약 24시간 내에 지갑으로 반환됩니다.
								</p>
								{txHash && <p className="text-xs font-mono bg-dark-background p-2 rounded-md">{txHash}</p>}
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
								<p className="font-medium">해지 요청 실패</p>
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
