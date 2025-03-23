import { create } from 'zustand';

// 스테이킹 기록 타입 정의
export interface StakingHistoryEntry {
	date: string;
	staked: number;
	reward: number;
}

// 스테이킹 정보 인터페이스
export interface StakingInfo {
	walletAddress: string | null;
	stakedAmount: number;
	earnedReward: number;
	apr: number;
	history: StakingHistoryEntry[];
}

interface StakingStore {
	stakingInfo: StakingInfo;
	setStakingInfo: (info: Partial<StakingInfo>) => void;
	addHistoryEntry: (entry: StakingHistoryEntry) => void;
	resetStakingInfo: () => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
}

const INITIAL_STATE: StakingInfo = {
	walletAddress: null,
	stakedAmount: 0,
	earnedReward: 0,
	apr: 5.2, // 기본 APR 값 설정
	history: [
		// 테스트 데이터
		{ date: '2024-03-01', staked: 1000, reward: 4.2 },
		{ date: '2024-03-08', staked: 1000, reward: 8.6 },
		{ date: '2024-03-15', staked: 1500, reward: 15.1 },
		{ date: '2024-03-22', staked: 1500, reward: 21.8 },
	],
};

export const useStakingStore = create<StakingStore>((set) => ({
	stakingInfo: INITIAL_STATE,
	isLoading: false,

	setStakingInfo: (updates) =>
		set((state) => ({
			stakingInfo: {
				...state.stakingInfo,
				...updates,
			},
		})),

	addHistoryEntry: (entry) =>
		set((state) => ({
			stakingInfo: {
				...state.stakingInfo,
				history: [...state.stakingInfo.history, entry],
			},
		})),

	resetStakingInfo: () => set({ stakingInfo: INITIAL_STATE }),

	setIsLoading: (loading) => set({ isLoading: loading }),
}));
