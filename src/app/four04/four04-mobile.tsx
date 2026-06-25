'use client';

import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import { ErrorCard } from '@/components/cards/ErrorCard';

export default function NotFound() {
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
        <div className="text-5xl mb-2 font-pangolin text-black">FFCS-inator</div>

        <div className="text-2xl mb-8 font-pangolin text-black">By CodeChef-VIT</div>

        <ErrorCard
          bigText="404"
          title="OOPS! You have found this secret page!"
          subtitle="We have nothing to show here..."
          mobile={true}
        />
      </div>

      <div className="h-8" />

      <Footer type="mobile" />
    </div>
  );
}
