"use client";

import { ZButton } from "@/components/ui/Buttons";
import Footer from "@/components/ui/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

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

        <div className="relative w-fit h-fit mb-4">
          {/* 45° Shadow layer */}
          <span
            className="absolute left-1.5 top-1.5 select-none pointer-events-none font-poppins font-extrabold text-[96px] z-0 text-black"
            style={{
              WebkitTextStroke: '8px black',
            }}
          >
            404
          </span>
          {/* Stroke layer */}
          <span
            className="absolute left-0 top-0 select-none pointer-events-none font-poppins font-extrabold text-[96px] z-10 text-transparent"
            style={{
              WebkitTextStroke: '8px black',
            }}
          >
            404
          </span>
          {/* Fill layer */}
          <span
            className="relative select-none pointer-events-none font-poppins font-extrabold text-[96px] z-20 text-[#90BDFF]"
          >
            404
          </span>
        </div>

        <div className="text-xl mb-16 font-pangolin text-black">
          OOPS! You have found this secret page!<br />
          We have nothing to show here...
        </div>

        <ZButton
          type="regular"
          text="Home"
          color="purple"
          image="/icons/home.svg"
          onClick={() => router.push('/')}
        />
      </div>

      <div className="h-8" />

      <Footer type="mobile" />
    </div>
  );
}