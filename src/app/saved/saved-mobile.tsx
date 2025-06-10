"use client";

import { useState } from "react";

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
    <>
    <header></header>
    <section className="min-h-screen w-full bg-[#d0eef1] px-6 py-8 flex flex-col items-center justify-center">
      <div className="px-6 py-8 flex flex-col items-center w-full max-w-md"></div>
      {/* Heading */}
      <h1 className="text-4xl mb-6 text-black font-Pangolin"
      style={{ fontFamily: 'Pangolin, cursive' }}>
        Saved Timetables
      </h1>

      {/* Timetable List */}
      <ul className="w-full space-y-4">
        {timetable.map((name, index) => (
          <li
            key={index}
            className="grid grid-cols-[auto_1fr] items-center px-4 py-3 bg-[#bce6eb] text-black rounded-xl border-2 border-black shadow-md"
          >
            <span className="font-medium text-base mr-4">{index + 1}.</span>
            <span className="font-medium text-base truncate">{name}</span>
          </li>
        ))}
      </ul>

      {/* End of List */}
      <div className="text-sm text-gray-600 mt-10 border-t border-gray-400 w-full text-center pt-2">
        End of List
      </div>
    </section>
        <footer> </footer>
    </>
  );
}
