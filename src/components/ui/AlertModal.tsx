import React from "react";

type AlertModalProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export default function AlertModal({ open, message, onClose }: AlertModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#425D5F]/75 backdrop-blur-xs z-50 select-none">
      <div
        className="
          inline-flex flex-col
          rounded-3xl
          mb-8 mt-0
          outline outline-4 outline-black
          shadow-[10px_10px_0_0_black]
          box-border
          items-stretch
          max-w-[80vw] max-h-[80vh]
          min-w-[30rem] min-h-[12rem]
          bg-[#FFF8D1]
        "
      >
        <div
          className="
            rounded-t-3xl
            flex items-center
            text-lg
            font-semibold
            outline outline-4 outline-black
            justify-between
            relative
            pl-2
            h-12
            bg-[#FFEA79]
          "
        >
          
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
          {/* close button */}
          <div className="flex-1 text-right flex items-center justify-end">
            <div
              className="
                w-12 h-12
                bg-[#FF9A9A]
                rounded-tr-3xl
                flex items-center
                justify-center
                cursor-pointer
                outline outline-4 outline-black
                pt-1 pr-1
              "
              onClick={onClose}
            >
              <svg width={32} height={32} viewBox="0 0 32 32">
                <line x1="8" y1="8" x2="24" y2="24" stroke="black" strokeWidth="3" strokeLinecap="round" />
                <line x1="24" y1="8" x2="8" y2="24" stroke="black" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-lg font-poppins font-regular p-8">
          <div className="text-lg font-semibold text-center mb-4">{message}</div>
          <button
            className="mt-2 px-6 py-2 bg-[#75E5EA] border-2 border-black rounded-lg font-bold shadow-[2px_2px_0_0_black] hover:bg-[#6CC0C5] transition"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}