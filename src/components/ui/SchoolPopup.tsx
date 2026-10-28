'use client';

import React, { useState } from 'react';
import { ZButton } from './Buttons';
import ComboBox from './ComboBox';
import { BATCHES, PROGRAMMES, schoolInfo } from '@/lib/schools';

type SchoolPopupProps = {
  schools: string[];
  school: string;
  vtopOn: boolean;
  vtopBusy: boolean;
  onVtopChange: (on: boolean) => void;
  onConfirm: (school: string) => void;
  onClose: () => void;
};

function Toggle({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="text-left">
      <div className="mb-2 text-[11px] font-bold uppercase text-[#5E6E6F]">{label}</div>
      <div className="flex h-12 p-1 gap-1 bg-white rounded-xl border-2 border-black">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`flex-1 px-4 rounded-lg text-sm cursor-pointer border-[1.5px] ${
              value === option
                ? 'bg-ffcs-yellow border-black font-semibold'
                : 'border-transparent text-[#6B7B7C] font-medium'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SchoolPopup({
  schools,
  school,
  vtopOn,
  vtopBusy,
  onVtopChange,
  onConfirm,
  onClose,
}: SchoolPopupProps) {
  const [programme, setProgramme] = useState(schoolInfo(school).programme);
  const [batch, setBatch] = useState(schoolInfo(school).batch);
  const [picked, setPicked] = useState(school);

  const options = schools.filter(key => {
    const info = schoolInfo(key);
    return info.programme === programme && info.batch === batch;
  });

  const change = (setter: (val: string) => void) => (val: string) => {
    setter(val);
    setPicked('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-[#425D5F]/75 backdrop-blur-sm z-50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your school & batch"
        onClick={e => e.stopPropagation()}
        className="font-poppins bg-[#A7D5D7] rounded-4xl border-3 border-black shadow-[10px_10px_0_0_black] w-full max-w-4xl p-8 flex flex-col gap-6"
      >
        <div className="text-xl font-semibold">Your school &amp; batch</div>
        <div className="flex items-center gap-4 rounded-2xl border-2 border-black bg-ffcs-popup-purple p-4 text-left">
          <div className="flex-1">
            <div className="font-bold">My VTOP</div>
            <div className="text-sm">
              {vtopBusy
                ? 'Checking My VTOP...'
                : 'Use the courses from your VTOP account instead of a school list.'}
            </div>
          </div>
          <span className="font-semibold">{vtopOn || vtopBusy ? 'ON' : 'OFF'}</span>
          <button
            role="switch"
            aria-checked={vtopOn}
            aria-label="My VTOP"
            disabled={vtopBusy}
            onClick={() => onVtopChange(!vtopOn)}
            className={`relative w-[60px] h-[36px] rounded-[12px] border-[3px] border-black shadow-hard transition-all duration-100 active:shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] ${
              vtopBusy ? 'cursor-wait opacity-60' : 'cursor-pointer'
            } ${vtopOn || vtopBusy ? 'bg-ffcs-blue' : 'bg-ffcs-red'}`}
          >
            <span
              className={`absolute top-1/2 -translate-y-1/2 h-[24px] w-[24px] rounded-[8px] border border-black bg-white transition-all duration-100 ${
                vtopOn || vtopBusy ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
        <div
          className={`grid grid-cols-[378fr_181fr_232fr] gap-5 items-end ${vtopOn ? 'opacity-40 pointer-events-none' : ''}`}
        >
          <div className="text-left">
            <div className="mb-2 text-[11px] font-bold uppercase text-[#5E6E6F]">School</div>
            <div>
              <ComboBox
                tall
                label="Select school"
                value={picked}
                options={options}
                onChange={setPicked}
                renderOption={key => `${schoolInfo(key).code} — ${schoolInfo(key).name}`}
              />
            </div>
          </div>
          <Toggle
            label="Programme"
            options={PROGRAMMES}
            value={programme}
            onChange={change(setProgramme)}
          />
          <Toggle label="Batch" options={BATCHES} value={batch} onChange={change(setBatch)} />
        </div>
        <div className="flex justify-end">
          <ZButton
            type="long"
            text="Continue"
            color="green"
            disabled={!picked && !vtopOn}
            onClick={() => onConfirm(picked || school)}
          />
        </div>
      </div>
    </div>
  );
}
