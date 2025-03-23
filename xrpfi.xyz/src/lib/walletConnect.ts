import { Client } from 'xrpl';
import * as xrpl from 'xrpl';

// WalletConnect 설정
export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

// XRPL 노드 설정
const XRPL_NODE = 'wss://s.altnet.rippletest.net:51233'; // Testnet 사용

// Xaman API 키 설정
export const XAMAN_API_KEY = process.env.NEXT_PUBLIC_XAMAN_API_KEY || '';

// XRPL 클라이언트 생성 함수
export async function createXRPLClient() {
	try {
		const client = new Client(XRPL_NODE);
		await client.connect();
		return client;
	} catch (error) {
		console.error('XRPL 클라이언트 연결 실패:', error);
		throw error;
	}
}

// 잔액 조회 함수
export const getXRPBalance = async (address: string): Promise<number> => {
	// 주소가 비어있으면 0 반환
	if (!address) return 0;

	const client = new Client(XRPL_NODE);

	try {
		await client.connect();

		const response = await client.request({
			command: 'account_info',
			account: address,
			ledger_index: 'validated',
		});

		// XRP 잔액을 숫자로 변환 (drops에서 XRP로 변환, 1 XRP = 1,000,000 drops)
		const balanceInDrops = response.result.account_data.Balance;
		return Number(balanceInDrops) / 1000000;
	} catch (error: any) {
		if (
			(error.message && error.message.includes('Account not found')) ||
			(error.data && error.data.error === 'actNotFound')
		) {
			console.warn(`계정 ${address}가 테스트넷에 존재하지 않습니다. 테스트넷 XRP가 필요합니다.`);
			return 0;
		}

		console.error('XRP 잔액 조회 실패:', error);
		throw error;
	} finally {
		client.disconnect();
	}
};

// 테스트넷 계정 활성화 함수
export const activateTestnetAccount = (address: string): Promise<boolean> => {
	try {
		// 테스트넷 활성화용 XRP 요청 페이지 열기
		const testnetFaucetUrl = `https://testnet.xrpl.org/faucet/${address}`;
		window.open(testnetFaucetUrl, '_blank', 'noopener,noreferrer');

		// 안내 메시지 표시
		alert(
			`테스트넷 XRP 요청을 위해 새 창이 열렸습니다.\n\n1. "Create Account" 버튼을 클릭하세요.\n2. 테스트넷 XRP가 계정으로 전송될 때까지 기다리세요.\n3. 완료 후 이 페이지로 돌아와 잔액을 새로고침하세요.`
		);

		return Promise.resolve(true);
	} catch (error) {
		console.error('테스트넷 계정 활성화 오류:', error);
		return Promise.resolve(false);
	}
};

// Xaman(XUMM) 연결 정보
export const xamanConfig = {
	name: 'Xaman',
	description: 'XUMM 지갑으로 연결',
	chains: ['xrpl:testnet'], // 테스트넷 사용
};

// FuturePass 연결 정보 (MVP 최소 구현)
export const futurePassConfig = {
	name: 'FuturePass',
	description: 'FuturePass 지갑으로 연결',
	// The Root Network 연결 정보는 실제 연동 시 추가
};

// 지갑 연결 프로세스 공통 인터페이스
export interface WalletConnector {
	connect: () => Promise<{ address: string; type: 'xaman' | 'futurepass' }>;
	disconnect: () => Promise<void>;
	getBalance: (address: string) => Promise<number>;
	requestTestnetXRP?: (address: string) => Promise<boolean>;
}

// 클라이언트 사이드 전용 변수들
let xumm: any = null;
let isReady = false;
let isInitializing = false;

// Xaman SDK 초기화 함수 (브라우저 환경에서만 실행)
export const initXamanSDK = async (): Promise<void> => {
	// 서버 사이드 렌더링 환경이면 아무것도 하지 않음
	if (typeof window === 'undefined') return;

	// 이미 초기화 중이거나 준비된 상태라면 리턴
	if (isInitializing || isReady) return;

	// 초기화 중 플래그 설정
	isInitializing = true;

	try {
		// 이미 로드되었는지 확인
		if (window.document.getElementById('xaman-sdk')) {
			isInitializing = false;
			return;
		}

		// Xaman SDK 스크립트 로드
		const script = document.createElement('script');
		script.id = 'xaman-sdk';
		script.src = 'https://xumm.app/assets/cdn/xumm.min.js';
		script.async = true;

		// 스크립트 로드 완료 후 처리
		const loadPromise = new Promise<void>((resolve, reject) => {
			script.onload = () => {
				try {
					// Xaman SDK 초기화
					if (window.Xumm && XAMAN_API_KEY) {
						xumm = new window.Xumm(XAMAN_API_KEY);

						xumm.on('ready', () => {
							console.log('Xaman SDK ready');
							isReady = true;
							isInitializing = false;
							resolve();
						});

						// 에러 이벤트 처리
						xumm.on('error', (error: any) => {
							console.error('Xaman SDK error:', error);
							isInitializing = false;
							reject(error);
						});
					} else {
						console.error('Xaman SDK or API key is missing');
						isInitializing = false;
						reject(new Error('Xaman SDK or API key is missing'));
					}
				} catch (error) {
					console.error('Xaman SDK initialization error:', error);
					isInitializing = false;
					reject(error);
				}
			};

			script.onerror = (error) => {
				console.error('Failed to load Xaman SDK script:', error);
				isInitializing = false;
				reject(error);
			};
		});

		document.body.appendChild(script);

		await loadPromise;
	} catch (error) {
		console.error('Error in initXamanSDK:', error);
		isInitializing = false;
		throw error;
	}
};

// Xaman 지갑 연결 실제 구현
export const XamanConnector: WalletConnector = {
	connect: async () => {
		// 서버 사이드 렌더링 환경이면 오류 발생
		if (typeof window === 'undefined') {
			throw new Error('Cannot connect wallet in server-side environment');
		}

		try {
			// SDK가 초기화되지 않았다면 초기화
			if (!xumm) {
				await initXamanSDK();
			}

			if (!xumm || !isReady) {
				throw new Error('Xaman SDK is not initialized');
			}

			// 지갑 연결 (사용자 인증)
			await xumm.authorize();

			// 사용자 계정 정보 가져오기
			const account = await xumm.user.account;

			if (!account) {
				throw new Error('Failed to get account information');
			}

			return { address: account, type: 'xaman' };
		} catch (error) {
			console.error('Xaman wallet connection error:', error);
			throw error;
		}
	},

	disconnect: async () => {
		// 서버 사이드 렌더링 환경이면 바로 리턴
		if (typeof window === 'undefined') return;

		if (xumm && isReady) {
			try {
				await xumm.logout();
				console.log('Xaman wallet disconnected');
			} catch (error) {
				console.error('Xaman wallet disconnection error:', error);
			}
		}
	},

	getBalance: async (address: string) => {
		return getXRPBalance(address);
	},

	// 테스트넷 XRP 요청 함수 추가
	requestTestnetXRP: async (address: string) => {
		return activateTestnetAccount(address);
	},
};

// FuturePass 지갑 연결 모의 구현 (최소 MVP)
export const FuturePassConnector: WalletConnector = {
	connect: async () => {
		// 서버 사이드 렌더링 환경이면 오류 발생
		if (typeof window === 'undefined') {
			throw new Error('Cannot connect wallet in server-side environment');
		}

		// FuturePass 연결 로직 (모의 구현)
		const mockAddress = 'rLFNz6Y6pM9U4p2Diz8qvH7ZQUe8qzMnwF'; // 테스트용 주소
		return { address: mockAddress, type: 'futurepass' };
	},
	disconnect: async () => {
		// 연결 해제 로직
		console.log('FuturePass 지갑 연결 해제');
		return;
	},
	getBalance: getXRPBalance,
};

// TypeScript용 window 확장 인터페이스
declare global {
	interface Window {
		Xumm: any;
	}
}
