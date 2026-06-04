'use client';

import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import { ErrorCard } from '@/components/cards/ErrorCard';
import Navbar from '@/components/ui/Navbar';
import Loader from '@/components/ui/Loader';
import useScreenSize from '@/hooks/useScreenSize';

export default function AccessDenied({ isMobile }: { isMobile: boolean }) {
  const size = useScreenSize();

  if (size === null) return <Loader />;
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

      {!isMobile && <Navbar page="404" />}

      <div
        className={`flex-grow ${isMobile ? 'mt-8' : 'mt-16'} flex flex-col items-center text-center relative`}
      >
        {isMobile && (
          <>
            <div className="text-5xl mb-2 font-pangolin text-black">FFCS-inator</div>
            <div className="text-2xl mb-8 font-pangolin text-black">By CodeChef-VIT</div>
          </>
        )}
        <div className="h-36" />
        <ErrorCard
          bigText={`ACCESS DENIED`}
          title="Private Property! No Trespassing!"
          subtitle=""
          mobile={isMobile}
        />
      </div>

      <div className={isMobile ? 'h-8' : 'h-16'} />

      <Footer type={isMobile ? 'mobile' : 'desktop'} />
    </div>
  );
}
