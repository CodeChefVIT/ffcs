import React from 'react';
import Image from 'next/image';

const LandingMobile = () => {
  return (
    <div className="min-h-screen bg-[#CEE4E5] flex flex-col items-center justify-center pt-8 font-poppins">
      <Image
        src="/background.svg"
        alt="bg dots"
        width={1920} // Full width of the background
        height={1080} // Full height of the background
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-none h-auto z-0 object-cover"
      />
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm w-full space-y-8 z-1">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 font-pangolin">
            FFCS-inator
          </h1>
          <p className="text-sm text-gray-800 font-[Pangolin]">
            By CodeChef-VIT
          </p>
        </div>

        <Image
          src="/ffcs.svg"
          alt="icon"
          width={94} // w-24 = 96px
          height={94} // h-24 = 96px
          className="mb-4 z-0"
        />

        {/* Main Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl lg:text-3xl font-[400] mb-4 tracking-wide font-[Pangolin]">
            Create Your
          </h2>
          <h2 className="text-2xl lg:text-3xl font-[400] mb-4 tracking-wide font-[Pangolin]">
            Ideal Timetable!
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-[24px] text-black text-center font-poppins px-4">
          Use PC or Tablet For All Features
        </p>

        {/* Call to Action Button */}
        <button className="font-poppins font-medium bg-[#C1FF83] px-6 py-1 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-5 text-1xl">
          Saved Timetables
        </button>
      </div>

      {/* Bottom Wave Decoration and Footer - Combined */}
      <div className="w-full mt-auto">
        {/* Wave SVG */}
        <svg 
          viewBox="0 0 375 100" 
          className="w-full h-16 block"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <path
            d="M0,60 Q93.75,20 187.5,40 Q281.25,60 375,40 L375,100 L0,100 Z"
            fill="#96C0C2"
          />
        </svg>
        
        {/* Footer Background - No gap */}
        <div className="bg-[#96C0C2] w-full px-6 pb-8" style={{ marginTop: '-1px' }}>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
              <Image
                src="/cclogo.svg"
                alt="cclogo"
                width={79}
                height={87}
                className="self-center"
              />
            </div>
          </div>
          
          {/* Footer Text */}
          <div className="text-center font-medium">
            <p className="text-black">
              Made with
              <span className="text-black mx-1">♥</span>
              by CodeChef-VIT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingMobile;