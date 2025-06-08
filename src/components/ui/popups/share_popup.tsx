import React from "react";

interface SharePopupProps {
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#3f595a] z-50 px-4">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-xl bg-lime-50 rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline outline-4 outline-offset-[-2px] outline-black">
        {/* Header */}
        <div className="flex justify-between items-center h-14 bg-amber-400 rounded-t-3xl outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
          </div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl font-semibold font-['Poppins'] text-center flex-1">
            Share Timetable
          </span>
          <button
            onClick={onClose}
            className="w-13 h-14 flex items-center justify-center bg-red-300 rounded-tr-3xl outline outline-4 outline-offset-[-2px] outline-black text-xl font-bold relative left-4"
          >
            <img
              src="./x.svg"
              alt="x"
              className="felx justify-center w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mt-6 px-4 py-4">
          <p className="text-black text-2xl font-normal font-['Poppins']">
            Use this link to share your timetable with anyone
          </p>
        </div>

        {/* Link*/}
        <div className="flex justify-center mt-6 px-4">
          <div className="flex items-center justify-center gap-4 w-full max-w-xl h-14 bg-white/75 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline outline-4 outline-black px-4">
            <span className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Poppins']">
              ffcs.codechefvit.com/share?id=ABC123
            </span>
          </div>
        </div>


        {/* Copy Button */}
        <div className="flex justify-center mt-6 px-4">
          <button className="flex items-center justify-center gap-4 w-min h-14 bg-amber-200 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline outline-4 outline-black px-4">
            <span className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Poppins']">
              Copy
            </span>
          </button>
        </div>

        {/* Bottom Padding */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default SharePopup;
