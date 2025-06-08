import React from "react";

interface EmailLoginPopupProps {
  onClose: () => void;
}

const EmailLoginPopup: React.FC<EmailLoginPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#3f595a] z-50 px-4">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-xl bg-sky-100 rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline outline-4 outline-offset-[-2px] outline-black">
        {/* Header */}
        <div className="flex justify-between items-center h-14 bg-sky-300 rounded-t-3xl outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
          </div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl font-semibold font-['Poppins'] text-center flex-1">
            Email Report
          </span>
          
        </div>

        {/* Content */}
        <div className="text-center mt-6 px-4">
          <p className="text-black  md:text-2xl font-normal font-['Poppins'] leading-relaxed">
            A Report has been sent to your email ID
          </p>
        </div>

        {/*OK Button */}
        <div className="flex justify-center mt-6 px-4">
          <button 
          onClick={onClose}
          className="flex items-center justify-center gap-4 w-1/5 max-w-sm h-14 bg-blue-300 rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline outline-4 outline-black px-4">
            <span className="text-black text-lg sm:text-xl md:text-2xl font-bold font-['Poppins']">
              OK
            </span>
          </button>
        </div>

        {/* Bottom Padding */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default EmailLoginPopup;
