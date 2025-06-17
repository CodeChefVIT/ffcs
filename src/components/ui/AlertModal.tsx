'use client';

import React from "react";
import { ZButton } from "./Buttons";

type AlertModalProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | string;
};

const colorMap: Record<string, string[]> = {
  red: ["#FFD3D3", "#FF8C8C"],
  yellow: ["#FFF8D1", "#FFEA79"],
  green: ["#E5FFDE", "#ABDE9F"],
  blue: ["#E2F2F9", "#8BD5FF"],
  purple: ["#E4E9FC", "#94ACFF"],
};

export default function AlertModal({ open, message, onClose, color }: AlertModalProps) {
  if (!open) return null;

  const theme = colorMap[color] || ["#E4E9FC", "#94ACFF",];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#425D5F]/75 backdrop-blur-xs z-50 select-none">
      <div
        style={{ backgroundColor: theme[0] }}
        className={`
              inline-flex flex-col
              rounded-3xl
              mb-8 mt-0
              outline-4 outline-black
              shadow-[10px_10px_0_0_black]
              box-border
              items-stretch
              max-w-[80vw] max-h-[80vh]
              min-w-120 min-h-48
            `}
      >
        <div
          style={{ backgroundColor: theme[1] }}
          className={`
                rounded-t-3xl
                flex items-center
                text-lg
                font-semibold
                outline-4 outline-black
                justify-between
                relative
                pl-2
                h-12
              `}
        >
          {/* 3 circles */}
          <div className="flex-1 text-left flex items-center justify-start pl-4">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-black opacity-50"
                />
              ))}
            </div>
          </div>

          {/* popup title */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center flex items-center justify-center font-poppins font-bold text-2xl">
            Alert
          </div>

        </div>

        <div className="flex flex-col items-center justify-center text-lg font-poppins font-regular p-8">

          <div>
            <div className="break-words max-w-lg w-full text-center mt-2 mb-4 font-semibold">
              {message}
            </div>
            <div className="flex flex-row items-center justify-center gap-4 mb-2">
              <ZButton
                type="long"
                text="OK"
                color="blue"
                forceColor={theme[1]}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
