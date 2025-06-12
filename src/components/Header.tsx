import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center px-4 text-center bg-[#CEE4E5] overflow-hidden h-screen mb-16">

      <Image
        src="/art/bg_dots.svg"
        alt="bg dots"
        width={1920} // Full width of the background
        height={1080} // Full height of the background
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-none h-auto z-0 object-cover"
      />

      <Image
        src="/art/art_paper.svg"
        alt="paper"
        width={96} // = w-24
        height={96} // ~ h-24
        className="absolute left-[30%] top-[25%] sm:left-[5%] sm:top-[30%] md:left-[10%] md:top-[40%] lg:left-[7%] lg:w-32 z-10"
      />


      <Image
        src="/art/art_plane.svg"
        alt="plane"
        width={112} // w-28
        height={112}
        className="absolute right-[10%] top-[30%] sm:right-[5%] sm:top-[40%] md:top-[50%] lg:w-36 z-10 lg:right-[10%]"
      />

      <Image
        src="/art/letter_c.svg"
        alt="C"
        width={32} // w-8
        height={32}
        className="absolute left-[15%] top-[70%] sm:left-[10%] sm:top-[87%] z-10 lg:w-11"
      />

      <Image
        src="/art/letter_h.svg"
        alt="H"
        width={32} // w-8
        height={32}
        className="absolute left-[25%] top-[22%] z-10 md:top-[30%] lg:w-11"
      />

      <Image
        src="/art/letter_e.svg"
        alt="E"
        width={32} // w-8
        height={32}
        className="absolute right-[20%] top-[70%] sm:top-[80%] z-10 lg:w-11"
      />

      <Image
        src="/art/letter_f.svg"
        alt="F"
        width={32} // w-8
        height={32}
        className="absolute right-[10%] top-[78%] sm:top-[88%] z-10 lg:w-11"
      />

      <Image
        src="/art/art_rice.svg"
        alt="scribble"
        width={56} // w-14
        height={56}
        className="absolute left-[25%] top-[75%] sm:left-[13%] sm:top-[73%] md:left-[20%] z-10 lg:w-16 lg:top-[78%] rotate-[-70deg]"
      />

      <Image
        src="/art/art_boom.svg"
        alt="squiggle"
        width={56} // w-14
        height={56}
        className="absolute right-[25%] top-[25%] sm:right-[20%] md:top-[35%] z-10 lg:w-16 lg:top-[30%] lg:right-[25%]"
      />

      <div className="z-20 pt-40 pb-20">
        <div className="flex flex-col items-center justify-start gap-5">
          <Image
            src="/logo_ffcs.svg"
            alt="icon"
            width={94} // w-24 = 96px
            height={94} // h-24 = 96px
            className="mb-4"
          />

          <h1 className="text-4xl lg:text-5xl font-[400] mb-2 tracking-wide font-[Pangolin]">FFCS-inator</h1>

          <p className="font-poppins font-normal text-base text-black/70 mb-4 max-w-xl">
            FFCS-inator generates priority-based timetables in seconds. <br />
            No more clashes, no more stress.
          </p>

          <h2 className="text-2xl lg:text-3xl font-[400] mb-4 tracking-wide font-[Pangolin]">
            Create Your Ideal Timetable!
          </h2>

          <button className="font-poppins font-normal bg-[#A9CFFF] px-6 py-1 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-5 text-2xl">
            Start

            <Image
              src="/icons/arrow_down.svg"
              alt="down"
              width={28} // w-7 = 28px
              height={28} // h-7 = 28px
            />
          </button>
        </div>
      </div>

    </div>
  )
}
