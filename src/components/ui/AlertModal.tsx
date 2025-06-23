"use client";

import React, {useEffect} from "react";
import { ZButton } from "./Buttons";

type AlertModalProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  color: "red" | "yellow" | "green" | "blue" | "purple" | string;
};

const colorMap: Record<string, string[]> = {
  red: ["#FFD3D3", "#FF8C8C"],
  yellow: ["#FFF8D1", "#FFEA79"],
  green: ["#E5FFDE", "#ABDE9F"],
  blue: ["#E2F2F9", "#8BD5FF"],
  purple: ["#E4E9FC", "#94ACFF"],
};

export default function AlertModal({
  open,
  message,
  onClose,
  color,
}: AlertModalProps) {

  useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [open]);


  if (!open) return null;

  const theme = colorMap[color] || ["#E4E9FC", "#94ACFF"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div
        style={{ backgroundColor: theme[0] }}
        className="rounded-3xl shadow-[10px_10px_0_0_black] outline outline-black
                   flex flex-col items-stretch w-full max-w-screen-sm max-h-[85vh] overflow-hidden"
      >
        {/* Fixed Height Header */}
        <div
          style={{ backgroundColor: theme[1] }}
          className="h-14 min-h-14 flex items-center  border-b-4 border-black justify-between relative px-4 rounded-t-3xl"
        >
          {/* Left control dots */}
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-black opacity-50"
              />
            ))}
          </div>

          {/* Title centered */}
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold font-poppins">
            Alert
          </div>
        </div>

        {/* Scrollable content */}
        <div className="p-6 text-center text-base sm:text-lg font-poppins font-medium leading-relaxed text-black whitespace-pre-wrap overflow-auto flex-1">
          {message}
        </div>

        {/* Footer with button */}
        <div className="flex justify-center items-center pb-6">
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
  );
}