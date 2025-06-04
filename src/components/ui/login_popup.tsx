// components/GoogleLoginPopup.tsx
import React from "react";

interface GoogleLoginPopupProps {
  onClose: () => void;
}

const GoogleLoginPopup: React.FC<GoogleLoginPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#3f595a] z-50">
      <div className="relative w-[380px] bg-[#faf7e3] rounded-2xl shadow-xl border border-black p-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#fbc02d] rounded-t-2xl px-4 py-2">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-[#7b5d00] rounded-full" />
            <span className="w-3 h-3 bg-[#7b5d00] rounded-full" />
            <span className="w-3 h-3 bg-[#7b5d00] rounded-full" />
          </div>
          <span className="text-black font-bold text-lg">Sign in</span>
          <button
            className="w-6 h-6 bg-[#f28b82] text-black text-center rounded-full leading-6"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="text-center mt-6">
          <p className="text-gray-800 text-lg font-medium leading-relaxed">
            Please log-in to save and<br /> share your time-tables
          </p>

          <button className="mt-6 flex items-center justify-center gap-3 bg-white px-5 py-2 rounded-xl border-2 border-black shadow hover:shadow-md transition-all">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-black font-semibold">Login with Google</span>
          </button>
        </div>

        {/* Decorative Arrows */}
        <div className="absolute left-4 top-[40%] text-black text-xl select-none">➳</div>
        <div className="absolute right-4 top-[30%] text-black text-xl select-none">〰</div>
        <div className="absolute left-6 bottom-6 text-black text-xl select-none">↶</div>
        <div className="absolute right-6 bottom-6 text-black text-xl select-none">↷</div>
      </div>
    </div>
  );
};

export default GoogleLoginPopup;
