'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ComboBoxProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  renderOption?: (val: string) => string;
  // Grey text at the right of an option, e.g. a subject's domain.
  renderHint?: (val: string) => string;
  // Options searched once the student types. Defaults to `options`.
  searchOptions?: string[];
  // Taller box, for the school popup.
  tall?: boolean;
};

type MultiSelectorProps = {
  label: string;
  values: string[];
  options: string[];
  onChange: (vals: string[]) => void;
};

const boxClass = 'flex w-full bg-white/70 rounded-xl border-2 border-black overflow-hidden';
const listClass =
  'absolute left-0 z-20 w-full mt-2 p-1 bg-white border-2 border-black rounded-xl max-h-80 overflow-y-auto';
const rowClass = 'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#FFEA79]';
const icon = (src: string, size: string) => (
  <Image src={src} alt="icon" width={20} height={20} className={size} draggable={false} />
);

function Chevron({ open, onClick }: { open: boolean; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      className="flex items-center justify-center w-10 shrink-0 border-l-2 border-black bg-white/35 cursor-pointer"
    >
      {icon('/icons/chevron_down.svg', `w-3 h-3 ${open ? 'rotate-180' : ''}`)}
    </span>
  );
}

// Open state that closes on a click outside the box.
function useOpen() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return { isOpen, setIsOpen, ref };
}

export default function ComboBox({
  label,
  value,
  options,
  onChange,
  renderOption = option => option,
  renderHint,
  searchOptions = options,
  tall,
}: ComboBoxProps) {
  const { isOpen, setIsOpen, ref } = useOpen();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Opening lists every option; only text typed after opening narrows the list.
  const filteredOptions = (query ? searchOptions : options).filter(option =>
    renderOption(option).toLowerCase().includes(query.trim().toLowerCase())
  );

  const open = () => {
    if (isOpen) return;
    setQuery('');
    setIsOpen(true);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={ref} className="relative w-full font-semibold">
      <div className={`${boxClass} ${tall ? 'h-12' : 'h-9'}`}>
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : value && renderOption(value)}
          placeholder={(isOpen && value && renderOption(value)) || label}
          onClick={open}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="flex-1 min-w-0 px-3 bg-transparent font-medium text-black placeholder:text-ffcs-muted truncate outline-none"
        />

        {value && !isOpen && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => onChange('')}
            className="px-2 cursor-pointer"
            tabIndex={-1}
          >
            {icon('/icons/cross.svg', 'w-4 h-4')}
          </button>
        )}
        <Chevron
          open={isOpen}
          onClick={() => {
            if (isOpen) return setIsOpen(false);
            open();
            inputRef.current?.focus();
          }}
        />
      </div>

      {isOpen && (
        <ul className={listClass}>
          {filteredOptions.map(option => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`
                ${rowClass} justify-between
                ${value === option ? 'bg-ffcs-yellow font-bold' : ''}
              `}
            >
              <span className="truncate">{renderOption(option)}</span>
              {renderHint && (
                <span className="shrink-0 text-xs text-ffcs-muted">{renderHint(option)}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MultiSelector({ label, values, options, onChange }: MultiSelectorProps) {
  const { isOpen, setIsOpen, ref } = useOpen();
  const toggle = (option: string) =>
    onChange(values.includes(option) ? values.filter(v => v !== option) : [...values, option]);
  // Every pick is a tag when they fit, otherwise the first one and a count.
  const shown = values.join('').length <= 10 ? values : values.slice(0, 1);

  return (
    <div ref={ref} className="relative w-full font-semibold">
      <div className={`${boxClass} h-9 cursor-pointer`} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-1 min-w-0 items-center gap-1 px-2">
          {values.length === 0 && <span className="px-1 truncate text-ffcs-muted">{label}</span>}
          {shown.map(slot => (
            <span
              key={slot}
              className="flex items-center gap-1 shrink-0 h-6 pl-2 pr-1 rounded-md border-2 border-black bg-[#FFEA79] text-sm"
            >
              {slot}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  toggle(slot);
                }}
                className="cursor-pointer"
                tabIndex={-1}
              >
                {icon('/icons/cross.svg', 'w-3 h-3')}
              </button>
            </span>
          ))}
          {values.length > shown.length && (
            <span className="shrink-0 text-sm">+{values.length - shown.length}</span>
          )}
        </div>
        <Chevron open={isOpen} />
      </div>

      {isOpen && (
        <ul className={listClass}>
          {options.map(option => (
            <li key={option} onClick={() => toggle(option)} className={`${rowClass} font-medium`}>
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-md border-2 border-black ${values.includes(option) ? 'bg-[#C1FF83]' : 'bg-white'}`}
              >
                {values.includes(option) && icon('/icons/check.svg', 'w-4 h-4')}
              </span>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
