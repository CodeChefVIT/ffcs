'use client';

import React from 'react';
import Image from 'next/image';

type FacultyVariantArrowsProps = {
  count: number;
  selected: number;
  onSelect: (index: number) => void;
};

// Same look as the pagination end buttons in ViewTimeTable, mirrored left/right
const arrowClass =
  'bg-[#75E5EA] active:bg-[#6CC0C5] font-poppins border-2 border-black font-bold text-lg flex items-center justify-center text-center transition duration-100 h-12 w-12';

export default function FacultyVariantArrows({
  count,
  selected,
  onSelect,
}: FacultyVariantArrowsProps) {
  // Only one faculty combination for this layout: no arrows at all
  if (count <= 1) return null;

  const hasPrev = selected > 0;
  const hasNext = selected < count - 1;

  return (
    <div className="flex flex-row items-center justify-between pt-4">
      {hasPrev ? (
        <button
          onClick={() => onSelect(selected - 1)}
          title="Previous faculty combination"
          aria-label="Previous faculty combination"
          className={`${arrowClass} rounded-l-xl shadow-[-4px_4px_0_0_black] active:shadow-[-2px_2px_0_0_black] active:-translate-x-[2px] active:translate-y-[2px]`}
        >
          <span style={{ pointerEvents: 'none', display: 'flex' }}>
            <Image
              src="/icons/prev.svg"
              alt="Previous faculty combination"
              width={32}
              height={32}
              unselectable="on"
              draggable={false}
            />
          </span>
        </button>
      ) : (
        <div className="h-12 w-12" />
      )}

      {hasNext ? (
        <button
          onClick={() => onSelect(selected + 1)}
          title="Next faculty combination"
          aria-label="Next faculty combination"
          className={`${arrowClass} rounded-r-xl shadow-[4px_4px_0_0_black] active:shadow-[2px_2px_0_0_black] active:translate-x-[2px] active:translate-y-[2px]`}
        >
          <span style={{ pointerEvents: 'none', display: 'flex' }}>
            <Image
              src="/icons/next.svg"
              alt="Next faculty combination"
              width={32}
              height={32}
              unselectable="on"
              draggable={false}
            />
          </span>
        </button>
      ) : (
        <div className="h-12 w-12" />
      )}
    </div>
  );
}
