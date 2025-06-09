import Image from "next/image";
import React from "react";

interface GoogleLoginPopupProps {
  onClose: () => void;
}

const GoogleLoginPopup: React.FC<GoogleLoginPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm z-50 px-4">
<<<<<<< HEAD
      <div className="relative w-full max-w-md sm:max-w-xl md:max-w-xl bg-lime-50 rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline outline-4 outline-offset-[-2px] outline-black">
=======
      <div className="w-full max-w-md sm:max-w-xl md:max-w-xl bg-lime-50 rounded-3xl shadow-[7px_7px_7px_rgba(0,0,0,1.00)] outline-4 outline-offset-[-2px] outline-black">
>>>>>>> 2b0ead19b6e91bf11071fe6d18f3ff1c4ca17f17
        {/* Header */}
        <div className="flex justify-between items-center h-14 bg-amber-400 rounded-t-3xl outline-4 outline-offset-[-2px] outline-black px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
            <div className="w-3 h-3 bg-black/50 rounded-full" />
          </div>
          <span className="text-black text-xl sm:text-2xl md:text-3xl font-semibold font-['Poppins'] text-center flex-1">
            Sign in
          </span>
          <button
            onClick={onClose}
            className="w-13 h-14 flex items-center justify-center bg-red-300 rounded-tr-3xl outline-4 outline-offset-[-2px] outline-black text-xl font-bold relative left-4"
          >
            <Image
              src="./x.svg"
              alt="x"
              width={120}
              height={80}
              className="felx justify-center w-8 h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mt-6 px-24 py-4">
          <p className="text-black text-xl font-normal font-['Poppins']">
            Please log in to save and share your time-tables
          </p>
        </div>

        {/* Google Login Button */}
<<<<<<< HEAD
        <div className="flex justify-center mt-2 px-18">
          <button className="flex items-center justify-center gap-4 w-full max-w-80 h-14 bg-white rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline outline-4 outline-black px-4">
            <img
              src="./google.svg"
              alt="Google"
              className="w-10 h-10"
=======
        <div className="flex justify-center mt-6 px-4">
          <button className="flex items-center justify-center gap-4 w-full max-w-sm h-14 bg-white rounded-3xl shadow-[5px_5px_0px_rgba(0,0,0,1.00)] outline-4 outline-black px-4">
            <Image
              src="./google.svg"
              alt="Google"
              width={120}
              height={80}
              className="w-6 h-6"
>>>>>>> 2b0ead19b6e91bf11071fe6d18f3ff1c4ca17f17
            />
            <span className="text-black text-lg sm:text-xl md:text-lg font-bold font-['Poppins']">
              Login with Google
            </span>
          </button>
        </div>
        
        {/*doodles */}
        <div className="absolute top-18 left-10 w-10 h-10">
          <img
              src="./sparkle.svg"
              alt=""
               />
        </div>

        <div className="absolute top-20 right-11 w-10 h-10">
          <img
              src="./scribble.svg"
              alt=""
               />
        </div>

        <div className="absolute -bottom-2 left-8 w-18 h-16">
          <img
              src="./curved.svg"
              alt=""
               />
        </div>

        <div className="absolute -bottom-4 rotate-6 right-8 w-18 h-18">
          <img
              src="./loop.svg"
              alt=""
               />
        </div>

        {/* Bottom Padding */}
        <div className="h-18" />
      </div>
    </div>
  );
};

export default GoogleLoginPopup;
