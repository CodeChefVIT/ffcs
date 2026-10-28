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
    <div className="text-left font-semibold text-sm">
      {label}
      <div className="flex mt-1 p-1.5 gap-1 bg-white rounded-xl border-3 border-black">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-1 rounded-lg cursor-pointer font-semibold ${
              value === option
                ? 'bg-[#FFEA79] border-2 border-black'
                : 'border-2 border-transparent'
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
        <div className={`flex flex-wrap items-end gap-4 ${vtopOn ? 'opacity-40' : ''}`}>
          <div className="flex-1 min-w-64 text-left font-semibold text-sm">
            School
            <div className="mt-1">
              <ComboBox
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
        <div className="flex items-center gap-4 rounded-2xl border-2 border-black bg-[#E0D4FF] p-4 text-left">
          <div className="flex-1">
            <div className="font-bold">My VTOP</div>
            <div className="text-sm">
              Use the courses from your VTOP account instead of a school list.
            </div>
          </div>
          <button
            role="switch"
            aria-checked={vtopOn}
            aria-label="My VTOP"
            disabled={vtopBusy}
            onClick={() => onVtopChange(!vtopOn)}
            className={`flex w-14 h-8 p-0.5 items-center rounded-full border-2 border-black cursor-pointer ${
              vtopOn ? 'bg-[#7954BA] justify-end' : 'bg-white'
            }`}
          >
            <span className="w-6 h-6 rounded-full border-2 border-black bg-white" />
          </button>
        </div>
        <div className="flex justify-end">
          <ZButton
            type="long"
            text="Continue"
            color="green"
            disabled={!picked}
            onClick={() => onConfirm(picked)}
          />
        </div>
      </div>
    </div>
  );
}
