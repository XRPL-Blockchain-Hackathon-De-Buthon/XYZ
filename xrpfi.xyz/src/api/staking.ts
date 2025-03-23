import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { api, ApiResponse } from '@/api';

// 예상 수익 계산 요청 interface
export interface EstimateRewardRequest {
	amount: number;
	term?: number; // 예상 기간 (일), 기본값 365일
}

// 예상 수익 계산 응답 interface
export interface EstimateRewardResponse {
	dailyReward: number;
	monthlyReward: number;
	yearlyReward: number;
	apr: number;
}

// XRPL에서 EVM으로 브릿지 요청 interface
export interface BridgeXrplToEvmRequest {
	amount: string;
	sourceAddress: string;
	destinationAddress: string;
	sourceSeed?: string;
	autoSwap?: boolean;
}

// 브릿지 요청 응답 interface
export interface BridgeXrplToEvmResponse {
	requestId: string;
	status: string;
	sourceAddress: string;
	destinationAddress: string;
	amount: number;
	autoTransfer: boolean;
	autoSwap: boolean;
}

// 스테이킹 요청 interface
export interface StakeRequest {
	walletAddress: string;
	amount: number;
}

// 스테이킹 응답 interface
export interface StakeResponse {
	txHash: string;
	walletAddress: string;
	amount: number;
	timestamp: string;
	estimatedUnlockTime: string; // 예상 언락 가능 시간
}

/**
 * 스테이킹 예상 수익 계산 (Query)
 */
export const useGetEstimateRewardApi = (request: EstimateRewardRequest) => {
	const { amount, term = 365 } = request;
	const url = '/staking/estimate';
	return useQuery<AxiosResponse<ApiResponse<EstimateRewardResponse>>, AxiosError, EstimateRewardResponse>({
		queryKey: [url, amount, term],
		queryFn: () => api.get(url, { params: { amount, term } }),
		select: (res) => res.data.data as EstimateRewardResponse,
		enabled: amount > 0,
		staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
		retry: 1,
	});
};

/**
 * 스테이킹 예상 수익 계산 (Mutation)
 */
export const useEstimateRewardApi = () => {
	const url = '/staking/estimate';
	return useMutation<AxiosResponse<ApiResponse<EstimateRewardResponse>>, AxiosError, EstimateRewardRequest>({
		mutationFn: (data: EstimateRewardRequest) => api.post(url, data),
	});
};

/**
 * 스테이킹 실행
 */
export const useExecuteStakeApi = () => {
	const url = '/staking/execute';
	return useMutation<AxiosResponse<ApiResponse<StakeResponse>>, AxiosError, StakeRequest>({
		mutationFn: (data: StakeRequest) => api.post(url, data),
	});
};

/**
 * 현재 스테이킹 APR 정보 가져오기
 */
export const useGetCurrentAprApi = () => {
	const url = '/staking/apr';
	return useQuery<AxiosResponse<ApiResponse<number>>, AxiosError, number>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data.data as number,
		staleTime: 60 * 60 * 1000, // 1시간 동안 데이터 유지
	});
};

// 해지 가능한 스테이킹 정보 interface
export interface WithdrawableStaking {
	walletAddress: string;
	totalStakedAmount: number;
	withdrawableAmount: number;
	lockedAmount: number;
	earnedReward: number;
	pendingWithdrawals: PendingWithdrawal[];
}

// 진행 중인 해지 요청 interface
export interface PendingWithdrawal {
	requestId: string;
	amount: number;
	requestTimestamp: string;
	estimatedCompletionTime: string;
	status: 'pending' | 'processing' | 'completed' | 'failed';
}

// 해지 요청 interface
export interface WithdrawRequest {
	walletAddress: string;
	amount: number;
}

// 해지 응답 interface
export interface WithdrawResponse {
	requestId: string;
	txHash: string;
	walletAddress: string;
	amount: number;
	timestamp: string;
	estimatedCompletionTime: string;
	fee: number;
}

/**
 * 해지 가능한 스테이킹 정보 조회
 */
export const useGetWithdrawableStakingApi = (address?: string) => {
	const url = address ? `/withdraw/available/${address}` : '/withdraw/available';
	return useQuery<AxiosResponse<ApiResponse<WithdrawableStaking>>, AxiosError, WithdrawableStaking>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data.data as WithdrawableStaking,
		enabled: !!address,
		staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
	});
};

/**
 * 스테이킹 해지 요청
 */
export const useRequestWithdrawApi = () => {
	const url = '/withdraw/request';
	return useMutation<AxiosResponse<ApiResponse<WithdrawResponse>>, AxiosError, WithdrawRequest>({
		mutationFn: (data: WithdrawRequest) => api.post(url, data),
	});
};

/**
 * 진행 중인 해지 요청 상태 확인
 */
export const useGetWithdrawStatusApi = (requestId?: string) => {
	const url = requestId ? `/withdraw/status/${requestId}` : '/withdraw/status';
	return useQuery<AxiosResponse<ApiResponse<PendingWithdrawal>>, AxiosError, PendingWithdrawal>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data.data as PendingWithdrawal,
		enabled: !!requestId,
		refetchInterval: 30000, // 30초마다 자동 갱신
		retry: 1,
	});
};

/**
 * XRPL에서 EVM으로 스테이킹 브릿지 요청
 */
export const useBridgeXrplToEvmApi = () => {
	const url = '/api/bridge/xrpl-to-evm';
	return useMutation<AxiosResponse<ApiResponse<BridgeXrplToEvmResponse>>, AxiosError, BridgeXrplToEvmRequest>({
		mutationFn: (data: BridgeXrplToEvmRequest) => api.post(url, data),
	});
};
