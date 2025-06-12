import Image from "next/image";
import React from "react";

interface SavePopupProps {
  onClose: () => void;
}

const SavePopup: React.FC<SavePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm z-50 px-4">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-xl bg-green-100 rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline-4 outline-offset-[-2px] outline-black">
        {/* Header */}
        <div className="flex justify-between items-center h-14 bg-green-300 rounded-t-3xl outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
          </div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl font-semibold font-['Poppins'] text-center flex-1">
            Save Timetable
          </span>
          <button
            onClick={onClose}
            className="w-13 h-14 flex items-center justify-center bg-red-300 rounded-tr-3xl outline-4 outline-offset-[-2px] outline-black text-xl font-bold relative left-4"
          >
            <Image
              src="/icons/cross.svg"
              alt="x"
              width={120}
              height={80}
              className="felx justify-center w-8 h-8"
            />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mt-6 px-4 py-4">
          <p className="text-black text-2xl font-normal font-['Poppins']">
            This will be saved to your collection. Please enter a unique name.
          </p>
        </div>

        {/* Input + Save Button + Error Message Wrapper */}
        <div className="flex flex-col items-center mt-6 px-4 py-4 w-full">
          {/* Input + Save Button (Responsive Wrapping) */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
            <input
              type="text"
              defaultValue="Untitled timetable 1"
              className="flex-1 px-4 py-3 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline-4 outline-black text-black text-lg sm:text-xl md:text-2xl font-['Poppins'] bg-white"
            />
            <button
              className="px-6 py-3 bg-lime-300 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline-4 outline-black text-black text-lg sm:text-xl md:text-2xl font-bold font-['Poppins']">
              Save
            </button>
          </div>

          {/* Duplicate Message */}
          <div className="mt-2 w-full max-w-md text-left">
            <p className="text-red-600 text-sm sm:text-base font-normal font-['Poppins'] px-2">
              *A timetable with this name already exists
            </p>
          </div>
        </div>


        {/* Bottom Padding */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default SavePopup;
