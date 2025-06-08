import React from "react";

interface RenamePopupProps {
  onClose: () => void;
}

const RenamePopup: React.FC<RenamePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#3f595a] z-50 px-4">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-xl bg-indigo-100 rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline outline-4 outline-offset-[-2px] outline-black">
        {/* Header */}
        <div className="flex justify-between items-center h-14 bg-indigo-300 rounded-t-3xl outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
          </div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl font-semibold font-['Poppins'] text-center flex-1">
            Rename Timetable
          </span>
          <button
            onClick={onClose}
            className="w-13 h-14 flex items-center justify-center bg-red-300 rounded-tr-3xl outline outline-4 outline-offset-[-2px] outline-black text-xl font-bold relative left-4"
          >
            <img
              src="./x.svg"
              alt="x"
              className="felx justify-center w-8 h-8"
            />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mt-6 px-4 py-4">
          <p className="text-black text-2xl font-normal font-['Poppins']">
            Rename this timetable from <br /> ‘ffcs-paglu’
          </p>
        </div>

{/* Text Input + Remove Button Side-by-Side */}
<div className="flex justify-center gap-10 mt-6 px-4 py-4">
  {/* Text Input */}
  <input
    type="text"
    defaultValue="Untitled timetable 1"
    className="px-4 py-3 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline outline-4 outline-black text-black text-lg sm:text-xl md:text-2xl font-['Poppins'] w-full max-w-xs bg-white"
  />

  {/* Save Button */}
  <button 
    className="flex items-center justify-center gap-4 px-6 py-3 bg-lime-300 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline outline-4 outline-black">
    <span className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Poppins']">
      Rename
    </span>
  </button>

  
</div>


        {/* Duplicate Message */}
        <div className="w-96 h-10 justify-center text-red-600 text-lg font-normal font-['Poppins'] px-4">*A timetable with this name already exists</div>




        {/* Bottom Padding */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default RenamePopup;
