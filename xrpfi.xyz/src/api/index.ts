// axios
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// 기본 API 응답 타입
export type ApiResponse<T> = {
	success: boolean;
	data?: T;
	error?: string;
};

// 공통 API 타입
export type CommonResType<T = any> = {
	status: 'SUCCESS' | 'FAIL';
	code: string;
	message: string;
	result: T;
};

// 공통 API 상태 코드
export enum ApiStatusCode {
	SUCCESS = 200,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	INTERNAL_ERROR = 500,
}

// API URL 환경 설정 (실제 구현시 .env에서 관리)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.xrpfi.xyz';

// Mock API 응답 지연 시간 (ms)
export const MOCK_API_DELAY = 1000;

// axios instance 생성
export const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 요청 인터셉터
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// 토큰이 필요한 경우 여기서 처리
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

// 응답 인터셉터
api.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

// API 클라이언트 메서드
export const apiClient = {
	get: <T>(url: string, params?: any, config?: any) => api.get<T>(url, { params, ...config }),
	post: <T>(url: string, data?: any, config?: any) => api.post<T>(url, data, config),
	put: <T>(url: string, data?: any, config?: any) => api.put<T>(url, data, config),
	delete: <T>(url: string, params?: any, config?: any) => api.delete<T>(url, { params, ...config }),
};
