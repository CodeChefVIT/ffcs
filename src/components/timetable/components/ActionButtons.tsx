
'use client'

import React from 'react';

const buttons = [
  { label: 'Email', bg: 'bg-yellow-300', icon: '/icons/email.svg' },
  { label: 'Save', bg: 'bg-green-300', icon: '/icons/save.svg' },
  { label: 'Report', bg: 'bg-blue-300', icon: '/icons/report.svg' },
  { label: 'Share', bg: 'bg-green-300', icon: '/icons/share.svg' },
  { label: 'Download', bg: 'bg-yellow-300', icon: '/icons/download.svg' },
];

const ActionButtons = () => {
  return (
    <div className="flex gap-3 p-4">
       {buttons.map((btn, index) => (
        <button
          key={index}
          className={`flex items-center gap-2 px-4 py-2 ${btn.bg} border border-black rounded-lg shadow-[3px_3px_0_0_black] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
        >
          <span className="text-m font-medium">{btn.label}</span>
          <img src={btn.icon} alt={btn.label} className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
