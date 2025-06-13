"use client";

import { useState } from "react";
import { ZButton } from "@/components/ui/Buttons";
import { FooterMobile } from "@/components/ui/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";

const dummyTimetables: string[] = [
  "Evening Theory",
  "5:30 before lab",
  "Too good to be true",
  "FFCS hatao desh bachao",
  "Abki baar Vishwanathan Sarkar",
  "Dummy Timetable",
  "Another Timetable",
  "Yet Another Timetable",
];

export default function SavedMobile() {
  const router = useRouter();
  const [timetable] = useState(dummyTimetables);

  return (
    <div className="flex flex-col min-h-screen relative items-center font-poppins">

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

      <div className="w-full px-4 py-2 flex justify-between items-center text-black select-none">
        <div className="text-2xl font-[pangolin]" onClick={() => router.push('/')}>FFCS-inator</div>
        <ZButton
          type="regular"
          text="Logout"
          color="red"
          onClick={() => router.push('/logout')}
        />
      </div>

      <div className="text-4xl mb-8 mt-8 text-black font-pangolin">Saved Timetables</div>

      <ul className="w-full space-y-4 px-6">
        {timetable.map((name, index) => (
          <li
            key={index}
            className="grid grid-cols-[auto_1fr] items-center px-3 py-3 bg-[#A7D5D7] text-black rounded-xl border-2 border-black shadow-[2px_2px_0_0_black]"
          >
            <span className="font-medium text-base mr-4">{index + 1}.</span>
            <span className="font-medium text-base truncate">{name}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center w-full mt-8 mb-8 text-sm font-poppins font-semibold text-black/50 px-8">
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent to-black/33" />
        {(dummyTimetables.length > 0) && (<span className="mx-4">End of List</span>)}
        {(dummyTimetables.length == 0) && (<span className="mx-4">Nothing To Show Here</span>)}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-black/33 to-transparent" />
      </div>

      {(dummyTimetables.length == 0) && (
        <div className="mx-auto my-auto text-center text-sm font-poppins font-semibold text-black/70">
          You do not have any saved timetables.<br />
          Create and save from the desktop website.
        </div>
      )}

      <FooterMobile />
    </div>
  );
}
