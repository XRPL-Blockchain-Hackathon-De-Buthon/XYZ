'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Wallet, Loader, LogOut, RefreshCw } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useWalletStore } from '@/store/walletState';
import { useToast } from '@/components/ui/ToastContainer';
import { usePathname } from 'next/navigation';

export default function GlobalHeader() {
	const { wallet, getAddressDisplay, disconnectWallet, refreshBalance, resetLoadingState, isClient } = useWallet();
	const { isWalletModalOpen, openWalletModal, closeWalletModal } = useWalletStore();
	const { showToast } = useToast();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	// 서버 렌더링 중에는 빈 주소를 사용
	const addressDisplay = isClient ? getAddressDisplay() : '';

	// 지갑 상태가 변경될 때마다 로컬 로딩 상태도 업데이트
	useEffect(() => {
		// 지갑이 연결되면 로딩 상태 해제
		if (wallet.connected) {
			setLocalLoading(false);
		}
	}, [wallet.connected]);

	// 모달이 닫힐 때 로딩 상태 초기화
	useEffect(() => {
		if (!isWalletModalOpen) {
			// 모달이 닫히면 무조건 로컬 로딩 상태 초기화
			setLocalLoading(false);

			// 지갑 연결이 되지 않은 상태에서 모달이 닫히면 글로벌 로딩 상태도 초기화
			if (!wallet.connected) {
				resetLoadingState();
			}
		}
	}, [isWalletModalOpen, wallet.connected, resetLoadingState]);

	// 드롭다운 외부 클릭 시 닫기
	useEffect(() => {
		if (!isClient) return;

		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isClient]);

	// 잔액 새로고침
	const handleRefreshBalance = async () => {
		if (isRefreshing) return;

		setIsRefreshing(true);
		try {
			await refreshBalance();
			showToast('success', '잔액이 업데이트되었습니다');
		} catch (error) {
			console.error('잔액 새로고침 실패:', error);
			showToast('error', '잔액 업데이트에 실패했습니다');
		} finally {
			setIsRefreshing(false);
			setIsDropdownOpen(false);
		}
	};

	// 지갑 연결 해제
	const handleDisconnect = async () => {
		try {
			const result = await disconnectWallet();
			if (result.success) {
				showToast('info', '지갑 연결이 해제되었습니다');
			} else if (result.error) {
				showToast('error', result.error);
			}
		} catch (error) {
			console.error('지갑 연결 해제 실패:', error);
			showToast('error', '지갑 연결 해제 중 오류가 발생했습니다');
		} finally {
			setIsDropdownOpen(false);
		}
	};

	// 지갑 연결 모달 열기
	const handleOpenWalletModal = () => {
		setLocalLoading(true);
		openWalletModal();
	};

	// 지갑 연결 모달 닫기
	const handleCloseWalletModal = () => {
		closeWalletModal();
		setLocalLoading(false);
		// 모달이 닫힐 때 확실하게 로딩 상태 초기화
		if (!wallet.connected) {
			resetLoadingState();
		}
	};

	return (
		<>
			<header className="sticky top-0 z-50 border-b border-dark-border py-4 bg-black backdrop-blur-sm bg-opacity-80">
				<div className="max-w-[768px] mx-auto px-4 flex justify-between items-center">
					<div className="flex items-center">
						<Link href="/" className="cursor-pointer mr-6">
							<Image
								src="/images/logo.png"
								alt="XRPFI 로고"
								width={120}
								height={40}
								className="hover:opacity-90 transition-opacity duration-150"
							/>
						</Link>
						<nav>
							<ul className="flex space-x-4">
								<li>
									<Link
										href="/staking"
										className={`font-semibold transition-all duration-150 cursor-pointer relative
											${
												pathname === '/staking'
													? 'after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-[currentColor] after:rounded-full'
													: 'after:content-[""] after:absolute after:left-0 after:right-full after:-bottom-1 after:h-0.5 after:bg-[currentColor] after:rounded-full after:transition-all after:duration-200 after:ease-out hover:after:right-0'
											}`}
									>
										스테이킹
									</Link>
								</li>
							</ul>
						</nav>
					</div>
					{isClient && (
						<div className="flex items-center space-x-3">
							{wallet.connected ? (
								<div className="relative" ref={dropdownRef}>
									<button
										onClick={() => setIsDropdownOpen(!isDropdownOpen)}
										className="flex items-center py-1 px-3 rounded-full bg-dark-card border border-dark-border hover:border-neon-purple transition-colors duration-150 cursor-pointer"
									>
										<div className="w-3 h-3 bg-neon-green rounded-full mr-2"></div>
										<span className="text-sm font-mono">{addressDisplay}</span>
									</button>

									{isDropdownOpen && (
										<div className="absolute right-0 mt-2 w-48 bg-dark-card rounded-md border border-dark-border shadow-lg z-50">
											<div className="py-1">
												<button
													onClick={handleRefreshBalance}
													disabled={isRefreshing}
													className="flex items-center w-full px-4 py-2 text-sm hover:bg-dark-border transition-colors duration-150 cursor-pointer"
												>
													<RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
													{isRefreshing ? '업데이트 중...' : '잔액 새로고침'}
												</button>
												<button
													onClick={() => {
														openWalletModal();
														setIsDropdownOpen(false);
													}}
													className="flex items-center w-full px-4 py-2 text-sm hover:bg-dark-border transition-colors duration-150 cursor-pointer"
												>
													<Wallet className="w-4 h-4 mr-2" />
													지갑 변경
												</button>
												<button
													onClick={handleDisconnect}
													className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-border transition-colors duration-150 cursor-pointer"
												>
													<LogOut className="w-4 h-4 mr-2" />
													연결 해제
												</button>
											</div>
										</div>
									)}
								</div>
							) : wallet.loading || localLoading ? (
								<button className="flex items-center py-1 px-3 text-sm rounded-full bg-dark-card border border-dark-border cursor-pointer">
									<Loader className="w-4 h-4 mr-2 animate-spin" />
									연결중...
								</button>
							) : (
								<button
									onClick={handleOpenWalletModal}
									className="flex items-center py-1 px-3 text-sm rounded-full bg-dark-card border border-dark-border hover:bg-dark-border transition-colors duration-150 cursor-pointer"
								>
									<Wallet className="w-4 h-4 mr-2" />
									지갑 연결
								</button>
							)}
						</div>
					)}
				</div>
			</header>
		</>
	);
}
