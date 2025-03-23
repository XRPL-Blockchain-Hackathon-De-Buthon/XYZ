'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Wallet, Loader, Info, AlertCircle } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useWalletStore, WalletType } from '@/store/walletState';
import { useToast } from '@/components/ui/ToastContainer';

export default function GlobalWalletModal() {
	const { connectWallet, wallet, resetLoadingState, isClient } = useWallet();
	const { isWalletModalOpen, closeWalletModal } = useWalletStore();
	const { showToast } = useToast();
	const [connectError, setConnectError] = useState<string | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// 클라이언트 사이드에서만 렌더링되도록 마운트 상태 확인
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// 서버 사이드 렌더링 시에는 null 반환
	if (!isMounted || !isClient) {
		return null;
	}

	const handleConnect = async (type: WalletType) => {
		try {
			setConnectError(null);
			setIsConnecting(true);

			const result = await connectWallet(type);

			if (result.success) {
				showToast('success', `${type === 'xaman' ? 'Xaman' : 'FuturePass'} 지갑이 연결되었습니다`);
				closeWalletModal();
			} else {
				setConnectError(result.error || '지갑 연결에 실패했습니다. 다시 시도해주세요.');
				// 명시적으로 로딩 상태 초기화
				resetLoadingState();
			}
		} catch (error) {
			console.error('지갑 연결 오류:', error);
			setConnectError('지갑 연결 중 오류가 발생했습니다.');
			// 에러 발생 시에도 로딩 상태 초기화
			resetLoadingState();
		} finally {
			setIsConnecting(false);
		}
	};

	// 모달 닫기 핸들러
	const handleClose = () => {
		// 닫기 전에 로딩 상태 초기화
		resetLoadingState();
		setIsConnecting(false);
		setConnectError(null);
		closeWalletModal();
	};

	return (
		<Modal isOpen={isWalletModalOpen} onClose={handleClose} title="지갑 연결" size="sm">
			<div className="space-y-4">
				<p className="text-sm text-gray-400 mb-4">XRPL 지갑을 연결하여 스테이킹 서비스를 이용하세요.</p>

				{connectError && (
					<div className="p-3 bg-red-950/40 border border-red-800/50 rounded-md flex items-start space-x-2 mb-2">
						<AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
						<p className="text-xs text-red-400">{connectError}</p>
					</div>
				)}

				<div className="flex flex-col space-y-3">
					<Button
						onClick={() => handleConnect('xaman')}
						className="w-full justify-start items-center"
						disabled={isConnecting}
					>
						{isConnecting && wallet.type === 'xaman' ? (
							<Loader className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Wallet className="mr-2 h-4 w-4" />
						)}
						Xaman (XUMM) 연결
					</Button>

					<Button
						onClick={() => handleConnect('futurepass')}
						className="w-full justify-start items-center"
						variant="secondary"
						disabled={isConnecting || true}
					>
						{isConnecting && wallet.type === 'futurepass' ? (
							<Loader className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Wallet className="mr-2 h-4 w-4" />
						)}
						FuturePass 연결 (준비 중)
					</Button>
				</div>

				<div className="p-3 bg-dark-background/40 rounded-md flex items-start space-x-2 mt-4">
					<Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
					<div className="text-xs text-gray-400">
						<p className="mb-1">Xaman 연결 시 알림창이 나타납니다. Xaman 앱에서 요청을 승인해주세요.</p>
						<p>FuturePass 연결은 현재 준비 중입니다.</p>
					</div>
				</div>

				<div className="pt-2 text-xs text-gray-400">
					<p>연결함으로써 이용약관 및 개인정보처리방침에 동의합니다.</p>
				</div>
			</div>
		</Modal>
	);
}
