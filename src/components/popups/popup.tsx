"use client";

import Image from "next/image";
import React from "react";

type PopupProps = {
  type: string;
  color: 'red' | 'yellow' | 'green' | 'green_2' | 'blue' | 'purple' | 'gray';
  body: string;
  closeLink: () => void;
  disabled?: boolean;
  clicked?: boolean;
};

export default function Popup() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#425D5F]/75 backdrop-blur-xs z-50 select-none">

      <div className={`
        w-140 h-80
        bg-[#E4E9FC]
        rounded-3xl
        mb-8 mt-0
        outline-4 outline-black
        shadow-[10px_10px_0_0_black]
      `}>

        <div
          className={`
            h-12
            rounded-t-3xl
            bg-[#94ACFF]
            flex items-center
            text-lg
            font-semibold
            outline-4 outline-black
            justify-between
            relative
          `}
        >

          {/* 3 circles */}
          <div className="flex-1 text-left flex items-center justify-start pl-4">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (<div key={i} className="w-4 h-4 rounded-full bg-black opacity-50" />))}
            </div>
          </div>

          {/* popup title */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center flex items-center justify-center font-poppins font-bold text-2xl">
            Popup Title
          </div>

          {/* close button */}
          <div className="flex-1 text-right flex items-center justify-end">
            <div
              className={`
              w-12 h-12
              bg-[#FF9A9A]
              rounded-tr-3xl
              flex items-center
              justify-center
              cursor-pointer
              outline-4 outline-black
              pt-1 pr-1
              `}
              onClick={() => { }}
            >
              <Image src="/icons/cross.svg" alt="close" width={32} height={32} />
            </div>
          </div>

        </div>
      </div>

    </div>

  );
};
