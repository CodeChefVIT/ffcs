'use client';

import Image from 'next/image';
import React from 'react';

const buttons = [
  { label: 'Email', bg: '#FFEA79', icon: '/icons/mail.svg' },
  { label: 'Save', bg: '#C1FF83', icon: '/icons/save.svg' },
  { label: 'Report', bg: '#90BDFF', icon: '/icons/report.svg' },
  { label: 'Share', bg: '#C1FF83', icon: '/icons/send.svg' },
  { label: 'Download', bg: '#FFEA79', icon: '/icons/download.svg' },
];

const ActionButtons = () => {
  return (
    <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-center sm:justify-start px-2 sm:px-4">
      {buttons.map((btn, index) => (
        <button
          key={index}
          style={{ backgroundColor: btn.bg }}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 border-2 border-black rounded-lg shadow-[3px_3px_0_0_black] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <span className="text-[clamp(0.8rem,1vw,1.1rem)] font-medium whitespace-nowrap">
            {btn.label}
          </span>
          <Image
            src={btn.icon}
            alt={btn.label}
            className="w-[clamp(14px,1.1vw,18px)] h-auto"
            width={18}
            height={18}
          />
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
