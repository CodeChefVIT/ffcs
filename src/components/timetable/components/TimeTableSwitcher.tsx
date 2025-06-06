'use client';

import React from 'react';

interface TimetableSwitcherProps {
  visibleStart: number;
  maxVisible: number;
  total: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onLeft: () => void;
  onRight: () => void;
}

export default function TimetableSwitcher({
  visibleStart,
  maxVisible,
  total,
  selectedIndex,
  onSelect,
  onLeft,
  onRight,
}: TimetableSwitcherProps) {
  const visibleIndexes = Array.from(
    { length: maxVisible },
    (_, i) => visibleStart + i
  ).filter((i) => i < total);

  return (
    <div className=" w-full flex justify-center">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 48,
          background: '#75E5EA',
          borderRadius: 12,
          border: '2px solid black',
          boxShadow: '3px 3px 0px black',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={onLeft}
          disabled={visibleStart === 0}
          style={{
            width: 48,
            height: 48,
            background: '#75E5EA',
            fontSize: 20,
            fontWeight: 700,
            cursor: visibleStart === 0 ? 'not-allowed' : 'pointer',
            opacity: visibleStart === 0 ? 0.4 : 1,
            border: 'none',
            borderRight: '2px solid black',
          }}
        >
          ‹
        </button>

        {visibleIndexes.map((i, idx) => (
          <div
            key={i}
            onClick={() => onSelect(i)}
            style={{
              width: 40,
              height: 48,
              background:
                selectedIndex === i ? 'rgba(255,255,255,0.4)' : '#75E5EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Poppins',
              cursor: 'pointer',
              borderRight: '2px solid black',
              borderLeft: idx === 0 ? '2px solid black' : 'none',
            }}
          >
            {i + 1}
          </div>
        ))}

        <button
          onClick={onRight}
          disabled={visibleStart + maxVisible >= total}
          style={{
            width: 48,
            height: 48,
            background: '#75E5EA',
            fontSize: 20,
            fontWeight: 700,
            cursor:
              visibleStart + maxVisible >= total ? 'not-allowed' : 'pointer',
            opacity: visibleStart + maxVisible >= total ? 0.4 : 1,
            border: 'none',
            borderLeft: '2px solid black',
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
