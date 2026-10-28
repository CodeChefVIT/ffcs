'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZButton } from './Buttons';
import { BATCHES, NAMES, PROGRAMMES, schoolInfo } from '@/lib/schools';

type SchoolPopupProps = {
  schools: string[];
  school: string;
  vtopOn: boolean;
  vtopBusy: boolean;
  vtopStatus: React.ReactNode;
  onVtopChange: (on: boolean) => void;
  onConfirm: (school: string) => void;
  onClose: () => void;
};

const labelClass = 'mb-2 text-[11px] font-bold uppercase text-ffcs-muted';

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
      <div className={labelClass}>{label}</div>
      <div className="grid grid-cols-2 h-12 p-1 gap-1 bg-white/70 rounded-2xl border-[2.5px] border-black">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 rounded-[9.5px] text-sm whitespace-nowrap cursor-pointer ${
              value === option ? 'bg-ffcs-yellow font-semibold' : 'text-ffcs-muted font-medium'
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
  vtopStatus,
  onVtopChange,
  onConfirm,
  onClose,
}: SchoolPopupProps) {
  const [programme, setProgramme] = useState(schoolInfo(school).programme);
  const [batch, setBatch] = useState(schoolInfo(school).batch);
  const [picked, setPicked] = useState(school);
  const [query, setQuery] = useState('');

  const order = Object.keys(NAMES);
  const options = schools
    .filter(key => {
      const info = schoolInfo(key);
      return info.programme === programme && info.batch === batch;
    })
    .filter(key =>
      `${schoolInfo(key).code} ${schoolInfo(key).name}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    )
    .sort((a, b) => order.indexOf(schoolInfo(a).code) - order.indexOf(schoolInfo(b).code));

  // Where else a school has a list, e.g. "B.Tech · M.Tech · '25".
  const offered = (code: string) => {
    const infos = schools.map(schoolInfo).filter(info => info.code === code);
    return [
      ...PROGRAMMES.filter(p => infos.some(info => info.programme === p)),
      ...(infos.some(info => info.batch === BATCHES[1]) ? ["'25"] : []),
    ].join(' · ');
  };

  const change = (setter: (val: string) => void) => (val: string) => {
    setter(val);
    setPicked('');
  };

  const locked = vtopOn ? 'opacity-40 pointer-events-none' : '';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-ffcs-overlay/75 backdrop-blur-sm z-50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your school & batch"
        onClick={e => e.stopPropagation()}
        className="font-poppins bg-ffcs-card rounded-4xl border-3 border-black shadow-hard-lg w-full max-w-[900px] p-8 flex flex-col gap-6"
      >
        <div className="text-xl font-semibold">Your school &amp; batch</div>
        <div className={`flex gap-5 items-end ${locked}`}>
          <div className="flex-1 min-w-0 text-left">
            <div className={labelClass}>School</div>
            <label
              htmlFor="school-search"
              className="flex items-center h-12 px-4 bg-white/70 rounded-2xl border-[2.5px] border-black font-medium"
            >
              <span className={`truncate ${picked ? '' : 'text-ffcs-muted'}`}>
                {picked
                  ? `${schoolInfo(picked).code} — ${schoolInfo(picked).name}`
                  : 'Select school'}
              </span>
            </label>
          </div>
          <Toggle
            label="Programme"
            options={PROGRAMMES}
            value={programme}
            onChange={change(setProgramme)}
          />
          <Toggle label="Batch" options={BATCHES} value={batch} onChange={change(setBatch)} />
        </div>
        <div className="flex gap-5 text-left">
          <div
            className={`flex flex-col w-[520px] h-[448px] shrink-0 p-1 bg-white/70 rounded-2xl border-[2.5px] border-black shadow-hard ${locked}`}
          >
            <input
              id="school-search"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={'Search by code or name, e.g. "comp", "mech"…'}
              className="h-10 shrink-0 px-3 rounded-[9.5px] bg-ffcs-page text-sm font-medium outline-none placeholder:text-ffcs-muted"
            />
            <ul className="flex-1 mt-0.5 space-y-0.5 overflow-y-auto">
              {options.map(key => (
                <li
                  key={key}
                  onClick={() => setPicked(key)}
                  className={`flex items-center gap-3 h-10 px-3 rounded-[9.5px] text-sm cursor-pointer hover:bg-ffcs-yellow ${
                    picked === key ? 'bg-ffcs-yellow' : ''
                  }`}
                >
                  <span className="w-16 shrink-0 font-bold">{schoolInfo(key).code}</span>
                  <span className="flex-1 truncate">{schoolInfo(key).name}</span>
                  <span className="shrink-0 text-xs text-ffcs-muted">
                    {offered(schoolInfo(key).code)}
                  </span>
                  {picked === key && (
                    <Image
                      src="/icons/check.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                      draggable={false}
                    />
                  )}
                </li>
              ))}
              {options.length === 0 && (
                <li className="px-3 py-2 text-sm text-ffcs-muted">No school matches “{query}”</li>
              )}
            </ul>
          </div>
          <div className="flex-1 flex flex-col items-end justify-between">
            <div className="w-full rounded-2xl border-2 border-black bg-ffcs-violet-light p-4 shadow-hard">
              <div className="flex items-center justify-between gap-4">
                <div className="font-bold">My VTOP</div>
                <button
                  role="switch"
                  aria-checked={vtopOn}
                  aria-label="My VTOP"
                  disabled={vtopBusy}
                  onClick={() => onVtopChange(!vtopOn)}
                  className={`relative shrink-0 w-[60px] h-[36px] rounded-[12px] border-[3px] border-black shadow-hard transition-all duration-100 active:shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] ${
                    vtopBusy ? 'cursor-wait opacity-60' : 'cursor-pointer'
                  } ${vtopOn || vtopBusy ? 'bg-ffcs-blue' : 'bg-ffcs-red'}`}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 h-[24px] w-[24px] rounded-[6px] border border-black bg-white transition-all duration-100 ${
                      vtopOn || vtopBusy ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <div className="mt-2 text-sm">
                {vtopBusy
                  ? 'Checking My VTOP...'
                  : 'Use the courses from your VTOP account instead of a school list.'}
              </div>
              {vtopOn && <div className="mt-2">{vtopStatus}</div>}
            </div>
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
    </div>
  );
}
