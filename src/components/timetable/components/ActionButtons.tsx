'use client'

import Image from 'next/image';
import React from 'react';

const buttons = [
  { label: 'Email', bg: '#FFEA79', icon: '/mail.svg' },
  { label: 'Save', bg: '#C1FF83', icon: '/save.svg' },
  { label: 'Report', bg: '#90BDFF', icon: '/report.svg' },
  { label: 'Share', bg: '#C1FF83', icon: '/Send.svg' },
  { label: 'Download', bg: '#FFEA79', icon: '/download.svg' },
];

const ActionButtons = () => {
  return (
    <div className="flex gap-3 p-4">
      {buttons.map((btn, index) => (
        <button
          key={index}
          style={{ backgroundColor: btn.bg }}
          className="flex items-center gap-2 px-6 py-2 border-2 border-black rounded-lg shadow-[3px_3px_0_0_black] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <span className="text-lg font-medium">{btn.label}</span>
          <Image src={btn.icon} alt={btn.label} className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
