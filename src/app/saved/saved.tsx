"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Edit, Trash2 } from "lucide-react";

import useScreenSize from "@/hooks/useScreenSize";
import SavedMobile from "./saved-mobile";

const dummyTimetables = [
  "Evening Theory",
  "5:30 before lab",
  "Too good to be true",
  "FFCS hatao desh bachao",
  "Abki baar vishu ki sarkar",
];

export default function Saved() {
  const size = useScreenSize();
  const [timetable] = useState(dummyTimetables);

  if (size === "mobile") {
    return <SavedMobile />;
  }

  return (
    <>
      <header></header>

      <section className="w-full h-screen relative overflow-hidden">
        <Image
          src="/art/bg_dots.svg"
          alt="Background of ffcs page"
          fill
          className="object-cover z-0"
        />

        <h1
          className="absolute top-[20%] left-1/2 transform -translate-x-1/2 text-5xl font-light z-10 font-Pangolin text-black"
          style={{ fontFamily: "Pangolin, cursive" }}
        >
          Saved Timetables
        </h1>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[600px] rounded-[2rem] border bg-[#a6dde0]/90 p-6 shadow-lg backdrop-blur-md">
          <p
            className="mb-3 text-lg font-light font-Pangolin"
            style={{ fontFamily: "Pangolin, cursive" }}
          >
            Your Saved Timetables
          </p>

          <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {timetable.map((name, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-[#d2f4f6] px-4 py-2 rounded-full"
              >
                <span className="text-sm font-medium">
                  {index + 1}. {name}
                </span>
                <div className="flex space-x-2">
                  <button className="bg-yellow-200 p-1 rounded-full hover:scale-105">
                    <Eye size={16} />
                  </button>
                  <button className="bg-blue-300 p-1 rounded-full hover:scale-105">
                    <Edit size={16} />
                  </button>
                  <button className="bg-red-300 p-1 rounded-full hover:scale-105">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer></footer>
    </>
  );
}
