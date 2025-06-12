"use client";

import { useState } from "react";
import Image from "next/image";
import { RegularButton } from "@/components/ui/Buttons";
import { FooterMobile } from "@/components/ui/Footer";

const dummyTimetables = [
  "Evening Theory",
  "5:30 before lab",
  "Too good to be true",
  "FFCS hatao desh bachao",
  "Abki baar vishu ki sarkar",
];

export default function SavedMobile() {
  const [timetable] = useState(dummyTimetables);

  return (
    <div className="min-h-screen bg-[#CEE4E5] flex flex-col items-center font-poppins">
      <div className="w-full px-4 py-2 flex justify-between items-center text-black select-none">
        <div className="text-2xl font-[pangolin]">FFCS-Inator</div>
        <RegularButton
          text="Logout"
          color="red"
          onClick={() => (window.location.href = "/logout")}
        />
      </div>

      <h1 className="text-2xl mb-10 mt-12 text-black font-Pangolin">
        Saved Timetables
      </h1>

      <ul className="w-full space-y-4 px-6">
        {timetable.map((name, index) => (
          <li
            key={index}
            className="grid grid-cols-[auto_1fr] items-center px-3 py-3 bg-[#bce6eb] text-black rounded-xl border-2 border-black shadow-md"
          >
            <span className="font-medium text-base mr-4">{index + 1}.</span>
            <span className="font-medium text-base truncate">{name}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center w-full mt-12 text-sm font-poppins text-gray-600 px-6">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4">End of List</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      
        
          

          <FooterMobile/>
      
      
    </div>
  );
}
