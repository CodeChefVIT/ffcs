"use client";

import Image from "next/image";
import { ZButton } from "../ui/Buttons";

type NavbarProps = {
  page: "placeholder" | "normal";
};

export default function Hero({page} : NavbarProps) {
  return (
    <div className="relative w-[1280px] h-[720px] sm:w-[640px] sm:h-[800px] md:w-[960px] md:h-[960px] lg:w-[1280px] lg:h-[720px] flex justify-center items-center font-pangolin text-black overflow-hidden">
      <div className="absolute left-1/2 top-36 w-full transform -translate-x-1/2 flex flex-col items-center text-center">
        <Image
          src="/logo_ffcs.svg"
          alt="I"
          width={96}
          height={96}
          className="mx-auto mb-6 select-none"
          unselectable="on"
          draggable={false}
          priority
        />
        <div className="text-4xl sm:text-5xl md:text-6xl mb-6">FFCS-inator</div>
        <div className="text-sm sm:text-md font-poppins font-semibold text-black mb-6">
          Generate priority-based timetables in seconds.
          <br />
          No more clashes, no more stress.
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl mb-8">
          Create Your Ideal Timetable!
        </div>
        {(page == "placeholder") && 
        <div className="text-lg sm:text-xl font-poppins font-semibold text-black mb-6">
          We&apos;re almost ready!
          <br />
          The website will be up as soon as the coming semester&apos;s faculty list is available.
        </div>}
        {(page == "normal") && 
        <ZButton
          type="large"
          text="Start"
          image="/icons/arrow_down.svg"
          color="purple"
          onClick={() => {
            const el = document.getElementById("start");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />}
      </div>

     
      <div className="absolute top-[460px] left-[320px] sm:top-[400px] sm:left-[120px] md:top-[420px] md:left-[240px] rotate-[-60deg] z-[1] w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] md:w-[64px] md:h-[64px]">
        <Image src="/art/art_rice.svg" alt="rice" fill className="object-contain" />
      </div>

      <div className="absolute top-[200px] right-[360px] sm:top-[180px] sm:right-[120px] md:right-[240px] rotate-[-15deg] z-[1] w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] md:w-[64px] md:h-[64px]">
        <Image src="/art/art_boom.svg" alt="boom" fill className="object-contain" />
      </div>

      <div className="absolute top-[200px] left-[160px] sm:top-[160px] sm:left-[60px] md:left-[120px] z-[1] w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] md:w-[160px] md:h-[160px]">
        <Image src="/art/art_paper.svg" alt="paper" fill className="object-contain" />
      </div>

      <div className="absolute top-[240px] right-[128px] sm:top-[200px] sm:right-[32px] md:right-[96px] rotate-[3deg] z-[1] w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] md:w-[200px] md:h-[200px]">
        <Image src="/art/art_plane.svg" alt="plane" fill className="object-contain" />
      </div>

      <div className="absolute top-[520px] left-[148px] sm:top-[480px] sm:left-[40px] md:left-[100px] z-[1] w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]">
        <Image src="/art/letter_c.svg" alt="c" fill className="object-contain" />
      </div>

      <div className="absolute top-[200px] left-[400px] sm:left-[180px] md:left-[300px] rotate-[8deg] z-[1] w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]">
        <Image src="/art/letter_h.svg" alt="h" fill className="object-contain" />
      </div>

      <div className="absolute top-[428px] right-[280px] sm:right-[80px] md:right-[160px] z-[1] w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]">
        <Image src="/art/letter_e.svg" alt="e" fill className="object-contain" />
      </div>

      <div className="absolute top-[528px] right-[120px] sm:right-[40px] md:right-[100px] z-[1] w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]">
        <Image src="/art/letter_f.svg" alt="f" fill className="object-contain" />
      </div>

      <div className="absolute top-[880px] left-[32px] sm:top-[720px] sm:left-[16px] z-[1] w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]">
        <Image src="/art/letter_i.svg" alt="i" fill className="object-contain" />
      </div>

      <div className="absolute top-[1200px] left-[92px] sm:top-[900px] sm:left-[32px] z-[1] w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]">
        <Image src="/art/letter_m.svg" alt="m" fill className="object-contain" />
      </div>

      <div className="absolute top-[1052px] right-[48px] sm:top-[800px] sm:right-[16px] z-[1] w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px]">
        <Image src="/art/letter_k.svg" alt="k" fill className="object-contain" />
      </div>
    </div>
  );
}
