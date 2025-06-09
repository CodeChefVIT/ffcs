import React from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '600'],
});

export default function Header() {
    return (
        <div className="relative w-full flex flex-col items-center justify-center px-4 text-center bg-[#CEE4E5] overflow-hidden h-screen">

            <img
                src="/background.svg"
                alt="bg dots"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-none h-auto z-0 object-cover"
            />

            <img src="/paper.svg" alt="paper" className="absolute left-[30%] top-[25%] sm:left-[5%] sm:top-[30%] md:left-[10%] md:top-[40%] lg:left-[7%] w-24 lg:w-32 z-10" />
            <img src="/plane.svg" alt="plane" className="absolute right-[10%] top-[30%] w-28 sm:right-[5%] sm:top-[40%] md:top-[50%] lg:w-36 z-10 lg:right-[10%]" />
            <img src="/c.svg" alt="C" className="absolute left-[15%] top-[70%] sm:left-[10%] sm:top-[87%] w-8 z-10 lg:w-11" />
            <img src="/h.svg" alt="H" className="absolute left-[25%] top-[22%] w-8 z-10 md:top-[30%] lg:w-11" />
            <img src="/e.svg" alt="E" className="absolute right-[20%] top-[70%] sm:top-[80%] w-8 z-10 lg:w-11" />
            <img src="/f.svg" alt="F" className="absolute right-[10%] top-[78%] w-8 sm:top-[88%] z-10 lg:w-11" />

            <img src="/scribble-left.svg" alt="scribble" className="absolute left-[25%] top-[75%] sm:left-[13%] sm:top-[73%] md:left-[20%] w-14 z-10 lg:w-16 lg:top-[78%]" />
            <img src="/scribble-right.svg" alt="squiggle" className="absolute right-[25%] top-[25%] sm:right-[20%] md:top-[35%] w-14 z-10 lg:w-16 lg:top-[30%] lg:right-[25%]" />

            <div className="z-20 pt-40 pb-20">
                <div className="flex flex-col items-center justify-start gap-5">
                    <img src="/ffcs.svg" alt="icon" className="w-24 h-24 mb-4" />

                    <h1 className="text-4xl lg:text-5xl font-[400] mb-2 tracking-wide font-[Pangolin]">FFCS-inator</h1>

                    <p className={`${poppins.className} font-normal text-base text-black/70 mb-4 max-w-xl font-poppins`}>
                        FFCS-inator generates priority-based timetables in seconds. <br />
                        No more clashes, no more stress.
                    </p>

                    <h2 className="text-2xl lg:text-3xl font-[400] mb-4 tracking-wide font-[Pangolin]">
                        Create Your Ideal Timetable!
                    </h2>

                    <button className={`${poppins.className} font-normal bg-[#A9CFFF] px-6 py-1 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 font-normal flex items-center gap-5 text-2xl`}>
                        Start
                        <img src="/arrow-down.svg" alt="down" className="w-7 h-7" />
                    </button>
                </div>
            </div>

            <div className={`${poppins.className} font-normal absolute top-6 right-6 flex flex-col sm:flex-row gap-2 sm:gap-4 z-30`}>
                <button className="bg-[#75E5EA] px-6 py-2  cursor-pointer rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-semibold text-sm sm:text-base">
                    Saved Timetables
                </button>
                <button className="bg-[#C1FF83] px-6 py-2 cursor-pointer rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-semibold text-sm sm:text-base">
                    Log In
                </button>
            </div>

            <div className={`${poppins.className} font-normal absolute top-6 left-6 flex items-center gap-4 z-30`}>
                <img src="/cc-border.svg" alt="Logo" className="w-12 h-12" />
                <button className="bg-[#FFEA79] cursor-pointer px-6 py-2 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-semibold text-sm sm:text-base">
                    Slot View
                </button>
            </div>
        </div>
    )
}
