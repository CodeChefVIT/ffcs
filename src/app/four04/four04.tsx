'use client';

import Image from 'next/image';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
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

      <Navbar page="404" />

      <div className="flex-grow mt-24 flex flex-col items-center text-center relative">
        <ErrorCard
          bigText="404"
          title="OOPS! You have found this secret page!"
          subtitle="We have nothing to show here..."
        />
      </div>

      <div className="h-24" />

      <Footer />
    </div>
  );
}
