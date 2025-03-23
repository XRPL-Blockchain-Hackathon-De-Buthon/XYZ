import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 지갑 유형 정의
export type WalletType = 'xaman' | 'futurepass' | null;

// 지갑 상태 인터페이스
export interface WalletState {
	address: string | null;
	balance: number;
	connected: boolean;
	loading: boolean;
	type: WalletType;
}

interface WalletStore {
	wallet: WalletState;
	setWallet: (wallet: Partial<WalletState>) => void;
	resetWallet: () => void;
	getDisplayAddress: () => string;
	// 지갑 모달 상태 추가
	isWalletModalOpen: boolean;
	openWalletModal: () => void;
	closeWalletModal: () => void;
}

const INITIAL_STATE: WalletState = {
	address: null,
	balance: 0,
	connected: false,
	loading: false,
	type: null,
};

export const useWalletStore = create<WalletStore>()(
	persist(
		(set, get) => ({
			wallet: INITIAL_STATE,
			// 지갑 모달 상태 초기값
			isWalletModalOpen: false,

			setWallet: (updates) =>
				set((state) => ({
					wallet: {
						...state.wallet,
						...updates,
					},
				})),

			resetWallet: () => set({ wallet: INITIAL_STATE }),

			getDisplayAddress: () => {
				const { address } = get().wallet;
				if (!address) return '';

				return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
			},

			// 지갑 모달 상태 관리 함수
			openWalletModal: () => set({ isWalletModalOpen: true }),
			closeWalletModal: () => set({ isWalletModalOpen: false }),
		}),
		{
			name: 'xrpfi-wallet-storage', // 로컬 스토리지 키 이름
			partialize: (state) => ({
				wallet: {
					address: state.wallet.address,
					balance: state.wallet.balance,
					connected: state.wallet.connected,
					type: state.wallet.type,
					// loading 상태는 저장하지 않음 (항상 false로 초기화)
				},
				// 모달 상태는 저장하지 않음
			}),
		}
	)
);
