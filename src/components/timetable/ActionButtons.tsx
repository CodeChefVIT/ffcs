'use client';

import Image from 'next/image';
import React from 'react';

const buttons = [
	{ label: 'Email', bg: 'bg-[var(--button-yellow)]', icon: '/icons/mail.svg' },
	{ label: 'Save', bg: 'bg-[var(--button-green)]', icon: '/icons/save.svg' },
	{ label: 'Report', bg: 'bg-[var(--button-blue)]', icon: '/icons/report.svg' },
	{ label: 'Share', bg: 'bg-[var(--button-green)]', icon: '/icons/send.svg' },
	{ label: 'Download', bg: 'bg-[var(--button-yellow)]', icon: '/icons/download.svg' },
];

const ActionButtons = () => {
	return (
		<div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-center sm:justify-start px-2 sm:px-4">
			{buttons.map((btn, index) => (
				<button
					key={index}
					className={`flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 border-2 border-black rounded-lg shadow-[3px_3px_0_0_black] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${btn.bg}`}
				>
					<span className="text-[clamp(0.9rem,1vw,1.1rem)] font-medium whitespace-nowrap leading-none flex items-center">
						{btn.label}
					</span>
					<Image
						src={btn.icon}
						alt={btn.label}
						className="w-[clamp(16px,1.2vw,20px)] h-[clamp(16px,1.2vw,20px)] object-contain"
						width={20}
						height={20}
					/>
				</button>
			))}
		</div>
	);
};

export default ActionButtons;
