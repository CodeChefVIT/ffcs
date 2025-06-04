import React from "react";


interface GoogleLoginPopupProps {
  onClose: () => void;
}

const GoogleLoginPopup: React.FC<GoogleLoginPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#3f595a] z-50">
      <div className="w-[650px] h-[376px] bg-lime-50 rounded-[48px] shadow-[7px_7px_7px_7px_rgba(0,0,0,1.00)] outline outline-4 outline-offset-[-2px] outline-black">
        {/* Header */}
        <div className="flex w-[650px] h-14 bg-amber-400 rounded-tl-[48px] rounded-tr-[48px] outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="inline-flex items-center gap-3">
            <div className="w-4 h-4 bg-black/50 rounded-full" />
            <div className="w-4 h-4 bg-black/50 rounded-full" />
            <div className="w-4 h-4 bg-black/50 rounded-full" />
          </div>
          <span className="flex-1 justify-center text-center  w-38 h-12 text-black text-4xl font-semibold font-['Poppins'] place-self-center">
            Sign in
          </span>
          <button
            onClick={onClose}
            className="flex-item align-self w-16 h-14 bg-red-300 rounded-tr-[52px] outline outline-4 outline-offset-[-2px] outline-black left-4 relative"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="text-center mt-6">
          <p className="text-gray-800 text-3xl font-medium font-['Poppins'] leading-relaxed">
            Please log-in to save and<br /> share your time-tables
          </p>
        </div>

        <div className="w-96 h-20 relative">
          <button className="w-96 h-14 left-36 top-12 relative bg-white rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1.00)] outline outline-4 outline-black">
            <img
              src="./google.svg"
              alt="Google"
              className="-left-40 top-2 relative w-97 h-9"
            />
            <span className="w-80 h-11 text-center justify-center text-black text-3xl font-bold font-['Poppins'] -top-7 left-4 relative">Login with Google</span>
          </button>
        </div>

        {/* Decorative Arrows */}
       
      </div>
    </div>
  );
};

export default GoogleLoginPopup;
