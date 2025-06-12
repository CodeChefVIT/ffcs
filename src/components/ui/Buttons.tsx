"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type ButtonVariant = 'regular' | 'image' | 'long' | 'large';

type ZButtonProps = {
  type: ButtonVariant;
  text?: string;
  color: 'red' | 'yellow' | 'green' | 'green_2' | 'blue' | 'purple' | 'gray';
  image?: string;
  onClick?: () => void;
  disabled?: boolean;
  clicked?: boolean;
  forceColor?: string;
};

type ToggleButtonProps = {
  onToggle?: (selected: string) => void;
};

const colorMap = {
  red: '#FFAD93',
  yellow: '#FFEA79',
  green: '#C1FF83',
  green_2: '#59FF56',
  blue: '#75E5EA',
  purple: '#90BDFF',
  gray: '#969696',
};

const toggleOptions = ["Theory", "Lab"];


export function ZButton({ type, text, color, image, onClick, forceColor, disabled = false, clicked = false, }: ZButtonProps) {
  const variantClasses = {
    regular: 'h-12 rounded-xl px-4 text-base gap-2.5',
    image: 'h-12 rounded-xl px-4 text-base gap-2.5',
    long: 'h-12 rounded-xl px-8 text-base gap-2.5',
    large: 'h-[60px] rounded-2xl px-8 text-2xl gap-6',
  };

  const imageSize = type === 'large' ? 28 : 24;

  const backgroundColor = forceColor
    ? (disabled ? colorMap['gray'] : clicked ? colorMap['green_2'] : forceColor)
    : (disabled ? colorMap['gray'] : clicked ? colorMap['green_2'] : colorMap[color]);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ backgroundColor }}
      className={`
        font-poppins
        border-3 border-black
        font-semibold
        flex items-center justify-center text-center
        transition duration-100
        shadow-[4px_4px_0_0_black]
        ${disabled ? 'cursor-normal' : 'cursor-pointer'}
        ${disabled ? '' : 'active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]'}
        ${variantClasses[type]}
      `}
    >
      {text}
      {image && (
        <span style={{ pointerEvents: 'none', display: 'flex' }}>
          <Image src={image} alt="" width={imageSize} height={imageSize} />
        </span>
      )}
    </button>
  );
}

export function CCButton() {
  return (
    <a
      href="https://codechefvit.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'flex', pointerEvents: 'auto' }}
    >
      <Image
        src="/logo_cc.png"
        alt="CC Button"
        width={80}
        height={80}
        className="cursor-pointer select-none"
      />
    </a>
  );
}

export function FFCSButton() {
  return (
    <Image
      src="/logo_FFCS.svg"
      alt="CC Button"
      width={80}
      height={80}
      className="cursor-pointer select-none"
      onClick={() => window.location.href = '/'}
    />
  );
}

export function ToggleButton({ onToggle }: ToggleButtonProps) {

  const [selected, setSelected] = useState<string>(toggleOptions[0]);
  const [sizes, setSizes] = useState<{ [key: string]: { width: number; left: number } }>({});

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const newSizes: { [key: string]: { width: number; left: number } } = {};
    btnRefs.current.forEach((btn, idx) => {
      if (btn) {
        newSizes[toggleOptions[idx]] = {
          width: btn.offsetWidth,
          left: btn.offsetLeft,
        };
      }
    });
    setSizes(newSizes);
  }, []);

  const handleSelect = (label: string) => {
    setSelected(label);
    onToggle?.(label);
  };

  const setIsActive = useState(false)[1];

  return (
    <div
      style={{
        fontFamily: 'Poppins, sans-serif',
        height: '56px',
        borderRadius: '18px',
        userSelect: 'none',
        cursor: "pointer",
      }}
      className={`
        relative flex items-center
        border-[3px] border-black
        shadow-[4px_4px_0_0_black]
        transition-all duration-100
        bg-[${colorMap['yellow']}]
        px-2 py-1
        w-fit
        active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]
      `}
      onClick={() => handleSelect(selected === toggleOptions[0] ? toggleOptions[1] : toggleOptions[0])}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
    >
      {/* White highlight that wraps text */}
      {sizes[selected] && (
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[80%] bg-white border border-black transition-all duration-100 ease-in-out"
          style={{
            left: sizes[selected].left,
            width: sizes[selected].width,
            zIndex: 1,
            borderRadius: '15px',
          }}
        />
      )}

      {/* Toggle buttons */}
      {toggleOptions.map((label, idx) => (
        <button
          key={label}
          ref={(el) => { btnRefs.current[idx] = el; }}
          onClick={e => { e.stopPropagation(); handleSelect(label); }}
          className="relative z-10 px-4 py-0 text-base font-semibold transition-colors duration-200"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "700",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function GoogleLoginButton({ onClick }: { onClick?: () => void }) {

  const buttonColor = "#ffffff";

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: buttonColor,
        fontFamily: 'Poppins, sans-serif',
        height: '48px',
        borderRadius: '16px',
        userSelect: 'none',
      }}
      className={`  
      text-black  
        px-4 py-2  
        border-3 border-black  
        font-semibold  
        text-base  
        cursor-pointer  
        flex items-center justify-center text-center gap-2.5  
        transition duration-100  
        shadow-[4px_4px_0_0_black]  
        active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]  
      `}
    >

      <span style={{ pointerEvents: 'none', display: 'flex' }}>
        <Image src="/social/google.svg" alt="" width={24} height={4} />
      </span>

      {"Login with Google"}

    </button>
  );
}
