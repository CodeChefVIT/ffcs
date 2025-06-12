import React from "react";

interface RemovePopupProps {
  onClose: () => void;
}

const RemovePopup: React.FC<RemovePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm z-50 px-4">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-xl bg-rose-200 rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline-4 outline-offset-[-2px] outline-black">
        {/* Header */}
        <div className="flex justify-between items-center h-14 bg-rose-400 rounded-t-3xl outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
          </div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl font-semibold font-['Poppins'] text-center flex-1">
            Remove Course
          </span>

        </div>

        {/* Content */}
        <div className="text-center mt-6 px-4 py-4">
          <p className="text-black  md:text-2xl font-normal font-['Poppins'] leading-relaxed">
            Are you sure you want to remove this course?<br />‘Engineering Rizzology’
          </p>
        </div>


        {/* Cancel + Remove Buttons Side-by-Side */}
        <div className="flex justify-center gap-14 mt-6 px-4 py-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-4 px-6 py-3 bg-amber-200 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline-4 outline-black">
            <span className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Poppins']">
              Cancel
            </span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-4 px-6 py-3 bg-rose-400 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline-4 outline-black">
            <span className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Poppins']">
              Remove
            </span>
          </button>
        </div>

        {/* Bottom Padding */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default RemovePopup;
