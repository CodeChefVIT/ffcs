"use client";

import React from 'react';
import Image from 'next/image';
import { FooterMobile } from '@/components/ui/Footer';
import { ZButton } from '@/components/ui/Buttons';

export default function View() {
  return (
    <div className="flex flex-col min-h-screen relative select-none">
      <div className="absolute inset-0 -z-10 bg-[#CEE4E5]">
        <Image
          src="/art/bg_dots.svg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-top object-contain w-full h-full"
        />
      </div>


      <div className="flex-grow mt-16 flex flex-col items-center text-center relative">

        <div className="text-5xl mb-2 font-pangolin text-black">
          FFCS-inator
        </div>

        <div className="text-2xl mb-8 font-pangolin text-black">
          By CodeChef-VIT
        </div>

        <div className="mb-8">
          <Image src="/logo_ffcs.svg" alt="FFCS Logo" width={120} height={120} />
        </div>

        <div className="text-4xl mb-8 font-pangolin text-black">
          Create Your<br />
          Ideal Timetable!
        </div>

        <div className="text-xl mb-8 font-poppins text-black">
          Use PC or Tablet For All Features
        </div>

        <ZButton
          type="regular"
          text="Saved Timetables"
          color="green"
          onClick={() => { window.location.href = '/saved'; }}
        />
      </div>

      <div className="h-6" />

      <FooterMobile />
    </div>
  );
}
