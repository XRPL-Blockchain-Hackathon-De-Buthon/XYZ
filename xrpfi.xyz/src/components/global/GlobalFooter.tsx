'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';
import IconButton from '../ui/IconButton';

export default function GlobalFooter() {
	return (
		<footer className="border-t border-dark-border py-6 mt-auto">
			<div className="max-w-[768px] mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<Link href="/" className="cursor-pointer flex justify-center w-fit mx-auto md:mx-0">
							<Image
								src="/images/logo.png"
								alt="XRPFI 로고"
								width={100}
								height={33}
								className="hover:opacity-90 transition-opacity duration-150"
							/>
						</Link>
						<p className="text-sm text-gray-400 mt-2">XRPL 사용자를 위한 멀티체인 스테이킹 플랫폼</p>
					</div>

					<div className="flex flex-col items-center md:items-end">
						<div className="flex space-x-3 mb-3">
							<Link className="flex items-center gap-2" href="https://github.com/xrpfi" target="_blank">
								<IconButton icon={Github} variant="outline" size="sm" />
								<span className="text-xs text-gray-400">https://github.com/DeButhon-xyz-team</span>
							</Link>
						</div>
						<p className="text-sm text-gray-400">© 2024 XRPFI. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
