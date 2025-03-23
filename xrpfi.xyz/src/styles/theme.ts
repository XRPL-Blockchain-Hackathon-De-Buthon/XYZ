/**
 * 테마 스타일 가이드 - XRPFI 프로젝트
 */

export const colors = {
	// 네온 색상
	neonGreen: '#39ff14',
	neonBlue: '#00ffff',
	neonPurple: '#9d00ff',
	neonPink: '#ff00ff',

	// 다크 테마 색상
	darkBg: '#0a0a0a',
	darkCard: '#121212',
	darkBorder: '#2a2a2a',
	darkText: '#e5e5e5',

	// 액센트 색상
	accent1: '#1a1a1a',
	accent2: '#333333',

	// 상태 색상
	success: '#10b981',
	error: '#ef4444',
	warning: '#f59e0b',
	info: '#3b82f6',
};

export const spacing = {
	xs: '0.25rem', // 4px
	sm: '0.5rem', // 8px
	md: '1rem', // 16px
	lg: '1.5rem', // 24px
	xl: '2rem', // 32px
	xxl: '3rem', // 48px
};

export const typography = {
	fontFamily: {
		sans: 'Inter, system-ui, sans-serif',
	},
	fontSize: {
		xs: '0.75rem', // 12px
		sm: '0.875rem', // 14px
		base: '1rem', // 16px
		lg: '1.125rem', // 18px
		xl: '1.25rem', // 20px
		'2xl': '1.5rem', // 24px
		'3xl': '1.875rem', // 30px
		'4xl': '2.25rem', // 36px
	},
	fontWeight: {
		normal: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	},
};

export const effects = {
	transition: {
		fast: '150ms',
		default: '200ms',
		slow: '300ms',
	},
	shadow: {
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
	},
};
