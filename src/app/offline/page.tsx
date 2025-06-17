"use client";

import Image from "next/image";
import Footer from "@/components/ui/Footer";

export default function OfflinePage() {
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
          unselectable="on"
          draggable={false}
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
          <Image
            src="/logo_ffcs.svg"
            alt="FFCS Logo"
            width={120}
            height={120}
            unselectable="on"
            draggable={false}
            priority
          />
        </div>
        <div className="text-3xl mb-8 font-pangolin text-black">
          You are offline
        </div>
        <div className="text-xl mb-8 font-poppins text-black">
          Please check your internet connection and try again.
        </div>
      </div>
      <div className="h-8" />
      <Footer type="mobile" />
    </div>
  );
}
