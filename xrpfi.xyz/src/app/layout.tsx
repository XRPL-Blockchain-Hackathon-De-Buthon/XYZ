import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import GlobalHeader from '@/components/global/GlobalHeader';
import GlobalFooter from '@/components/global/GlobalFooter';
import { ToastContainer } from '@/components/ui/ToastContainer';
import ClientProviders from '@/components/global/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'XRPFI - XRPL 사용자를 위한 멀티체인 스테이킹',
	description: 'XRP를 예치하면 Axelar를 통해 PoS 체인으로 자산이 브릿징되고, 스테이킹 수익이 RLUSD로 지급됩니다',
	openGraph: {
		title: 'XRPFI - XRPL 사용자를 위한 멀티체인 스테이킹',
		description: 'XRP를 예치하면 Axelar를 통해 PoS 체인으로 자산이 브릿징되고, 스테이킹 수익이 RLUSD로 지급됩니다',
		siteName: 'XRPFI',
		url: 'https://xrpfi.vercel.app/',
		images: [
			{
				url: 'https://xrpfi.vercel.app/opengraph-image.png',
				alt: 'XRPFI OpenGraph Image',
			},
		],
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko" className="dark">
			<body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-b from-dark-background to-black`}>
				<ToastContainer>
					<ClientProviders>
						<GlobalHeader />
						{children}
						<GlobalFooter />
					</ClientProviders>
				</ToastContainer>
			</body>
		</html>
	);
}
