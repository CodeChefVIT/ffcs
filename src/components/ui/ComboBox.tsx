'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ComboBoxProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  renderOption?: (val: string) => string;
};

export default function ComboBox({ label, value, options, onChange, renderOption }: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
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

  const filteredOptions = options.filter(option => {
    const label = renderOption ? renderOption(option) : option;
    return label.toLowerCase().includes(inputValue.toLowerCase());
  });

  const handleSelect = (option: string) => {
    const renderedOption = renderOption ? renderOption(option) : option;
    onChange(option);
    setInputValue(renderedOption);
    setIsOpen(false);
  };

  useEffect(() => {
    if (value) setInputValue(renderOption ? renderOption(value) : value);
  }, [value, renderOption]);

  return (
    <div ref={ref} className="relative w-full font-semibold text-[#000000B2]">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          placeholder={label}
          onClick={() => setIsOpen(true)}
          onChange={e => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          className={`
            w-full h-10 pl-3 pr-12 bg-white rounded-xl border-3 border-black
            text-black truncate whitespace-nowrap overflow-hidden
          `}
        />

        {inputValue && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              setInputValue('');
              onChange('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            tabIndex={-1}
          >
            <Image
              src="/icons/cross.svg"
              alt="icon"
              className="w-5 h-5"
              width={20}
              height={20}
              unselectable="on"
              draggable={false}
              priority
            />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="absolute -left-2 -right-2 z-10 bg-white border-3 border-black rounded-xl mt-1 max-h-120 overflow-y-auto shadow-lg">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className={`
                px-4 py-2 cursor-pointer hover:bg-[#FFEA79]
                ${value === option ? 'bg-[#C1FF83] font-bold' : ''}
              `}
            >
              {renderOption ? renderOption(option) : option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
