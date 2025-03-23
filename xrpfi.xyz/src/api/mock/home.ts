import { ApiResponse } from '@/api';
import { StakingSummary, AssetHistory, DashboardData } from '../home';

// Mock API 응답 지연 시간 (ms)
export const MOCK_API_DELAY = 1000;

/**
 * 대시보드 데이터 가져오기 (스테이킹 요약 + 자산 추이)
 * @param address - 지갑 주소
 */
export const mockGetDashboardData = async (address: string): Promise<ApiResponse<DashboardData>> => {
	// Mock API 응답 시뮬레이션
	return new Promise((resolve) => {
		setTimeout(() => {
			// 테스트 데이터 생성
			const today = new Date();
			const history: AssetHistory[] = [];

			// 지난 30일간의 데이터 생성
			for (let i = 29; i >= 0; i--) {
				const date = new Date(today);
				date.setDate(date.getDate() - i);

				// 날짜 포맷팅 (YYYY-MM-DD)
				const formattedDate = date.toISOString().split('T')[0];

				// 스테이킹 금액과 보상 설정 (증가 추세)
				const staked = 500 + Math.floor(i * 25 * Math.random());
				const reward = Math.round((5 + i * 0.8) * 100) / 100;

				history.push({
					date: formattedDate,
					staked,
					reward,
				});
			}

			resolve({
				success: true,
				data: {
					summary: {
						walletAddress: address,
						stakedAmount: 1000,
						earnedReward: 25.8,
						rewardRate: 6.5,
						lastDistribution: today.toISOString().split('T')[0],
					},
					history,
				},
			});
		}, MOCK_API_DELAY);
	});
};

/**
 * 스테이킹 요약 정보만 가져오기
 * @param address - 지갑 주소
 */
export const mockGetStakingSummary = async (address: string): Promise<ApiResponse<StakingSummary>> => {
	// Mock API 응답 시뮬레이션
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				data: {
					walletAddress: address,
					stakedAmount: 1000,
					earnedReward: 25.8,
					rewardRate: 6.5,
					lastDistribution: new Date().toISOString().split('T')[0],
				},
			});
		}, MOCK_API_DELAY);
	});
};

/**
 * 자산 추이 데이터만 가져오기
 * @param address - 지갑 주소
 * @param days - 가져올 기간 (일)
 */
export const mockGetAssetHistory = async (address: string, days: number = 30): Promise<ApiResponse<AssetHistory[]>> => {
	// Mock API 응답 시뮬레이션
	return new Promise((resolve) => {
		setTimeout(() => {
			const today = new Date();
			const history: AssetHistory[] = [];

			// 지정된 일수만큼의 데이터 생성
			for (let i = days - 1; i >= 0; i--) {
				const date = new Date(today);
				date.setDate(date.getDate() - i);

				// 날짜 포맷팅 (YYYY-MM-DD)
				const formattedDate = date.toISOString().split('T')[0];

				// 스테이킹 금액과 보상 설정 (증가 추세)
				const staked = 500 + Math.floor(i * 25 * Math.random());
				const reward = Math.round((5 + i * 0.8) * 100) / 100;

				history.push({
					date: formattedDate,
					staked,
					reward,
				});
			}

			resolve({
				success: true,
				data: history,
			});
		}, MOCK_API_DELAY);
	});
};
