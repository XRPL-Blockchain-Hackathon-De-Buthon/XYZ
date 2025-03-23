import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { api, ApiResponse } from '@/api';

// API 타입 정의
export interface StakingSummary {
	walletAddress: string;
	stakedAmount: number;
	earnedReward: number;
	rewardRate: number; // APR (%)
	lastDistribution: string; // 마지막 보상 지급 날짜
}

export interface AssetHistory {
	date: string;
	staked: number;
	reward: number;
}

export interface DashboardData {
	summary: StakingSummary;
	history: AssetHistory[];
}

/**
 * 대시보드 데이터 가져오기 (스테이킹 요약 + 자산 추이)
 */
export const useGetDashboardDataApi = (address?: string) => {
	const url = address ? `/dashboard/${address}` : '/dashboard';
	return useQuery<AxiosResponse<ApiResponse<DashboardData>>, AxiosError, DashboardData>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data.data as DashboardData,
		enabled: !!address,
		staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
	});
};

/**
 * 스테이킹 요약 정보만 가져오기
 */
export const useGetStakingSummaryApi = (address?: string) => {
	const url = address ? `/staking/summary/${address}` : '/staking/summary';
	return useQuery<AxiosResponse<ApiResponse<StakingSummary>>, AxiosError, StakingSummary>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data.data as StakingSummary,
		enabled: !!address,
		staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
	});
};

/**
 * 자산 추이 데이터만 가져오기
 */
export const useGetAssetHistoryApi = (address?: string, days: number = 30) => {
	const url = address ? `/asset/history/${address}` : '/asset/history';
	return useQuery<AxiosResponse<ApiResponse<AssetHistory[]>>, AxiosError, AssetHistory[]>({
		queryKey: [url, days],
		queryFn: () => api.get(url, { params: { days } }),
		select: (res) => res.data.data as AssetHistory[],
		enabled: !!address,
		staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
	});
};
